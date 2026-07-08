using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

public class AuthService : IAuthService
{
  private readonly UserManager<ApplicationUser> _userManager;
  private readonly SignInManager<ApplicationUser> _signInManager;
  private readonly IConfiguration _configuration;
  private readonly IMapper _mapper;

  public AuthService(
      UserManager<ApplicationUser> userManager,
      SignInManager<ApplicationUser> signInManager,
      IConfiguration configuration,
      IMapper mapper)
  {
    _userManager = userManager;
    _signInManager = signInManager;
    _configuration = configuration;
    _mapper = mapper;
  }

  public async Task<ApiResponseDto<AuthResponseDto>> RegisterAsync(RegisterDto registerDto)
  {
    try
    {
      ApplicationUser? existingUser = await _userManager.FindByEmailAsync(registerDto.Email);
      if( existingUser != null )
      {
        return ApiResponseDto<AuthResponseDto>.ErrorResult("User with this email already exists");
      }

      ApplicationUser user = _mapper.Map<ApplicationUser>(registerDto);
      IdentityResult result = await _userManager.CreateAsync(user, registerDto.Password);

      if( !result.Succeeded )
      {
        List<string>? errors = result.Errors.Select(e => e.Description).ToList();
        return ApiResponseDto<AuthResponseDto>.ErrorResult("Registration failed", errors);
      }

      // Add user to default role
      await _userManager.AddToRoleAsync(user, "User");

      AuthResponseDto authResponse = await GenerateJwtToken(user);
      return ApiResponseDto<AuthResponseDto>.SuccessResult(authResponse, "Registration successful");
    }
    catch( Exception ex )
    {
      return ApiResponseDto<AuthResponseDto>.ErrorResult($"Registration error: {ex.Message}");
    }
  }

  public async Task<ApiResponseDto<AuthResponseDto>> LoginAsync(LoginDto loginDto)
  {
    try
    {
      ApplicationUser? user = await _userManager.FindByEmailAsync(loginDto.Email);
      if( user == null )
      {
        return ApiResponseDto<AuthResponseDto>.ErrorResult("Invalid email or password");
      }

      SignInResult result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
      if( !result.Succeeded )
      {
        return ApiResponseDto<AuthResponseDto>.ErrorResult("Invalid email or password");
      }

      AuthResponseDto authResponse = await GenerateJwtToken(user);
      return ApiResponseDto<AuthResponseDto>.SuccessResult(authResponse, "Login successful");
    }
    catch( Exception ex )
    {
      return ApiResponseDto<AuthResponseDto>.ErrorResult($"Login error: {ex.Message}");
    }
  }

  public async Task<ApiResponseDto<UserDto>> GetCurrentUserAsync(string userId)
  {
    try
    {
      ApplicationUser? user = await _userManager.FindByIdAsync(userId);
      if( user == null )
      {
        return ApiResponseDto<UserDto>.ErrorResult("User not found");
      }

      UserDto userDto = _mapper.Map<UserDto>(user);
      IList<string> roles = await _userManager.GetRolesAsync(user);
      userDto.Roles = roles.ToList();

      return ApiResponseDto<UserDto>.SuccessResult(userDto);
    }
    catch( Exception ex )
    {
      return ApiResponseDto<UserDto>.ErrorResult($"Error retrieving user: {ex.Message}");
    }
  }

  private async Task<AuthResponseDto> GenerateJwtToken(ApplicationUser user)
  {
    IConfigurationSection jwtSettings = _configuration.GetSection("JwtSettings");
    byte[] key = Encoding.ASCII.GetBytes(jwtSettings["Secret"] ?? "your-super-secret-key-that-is-at-least-256-bits-long");

    IList<string> roles = await _userManager.GetRolesAsync(user);

    List<Claim> claims = new List<Claim>
      {
          new Claim(ClaimTypes.NameIdentifier, user.Id),
          new Claim(ClaimTypes.Name, user.UserName ?? ""),
          new Claim(ClaimTypes.Email, user.Email ?? ""),
          new Claim("FirstName", user.FirstName ?? ""),
          new Claim("LastName", user.LastName ?? "")
      };

    foreach( string role in roles )
    {
      claims.Add(new Claim(ClaimTypes.Role, role));
    }

    SecurityTokenDescriptor tokenDescriptor = new SecurityTokenDescriptor
    {
      Subject = new ClaimsIdentity(claims),
      Expires = DateTime.UtcNow.AddDays(7),
      SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
    };

    JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
    SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);

    UserDto userDto = _mapper.Map<UserDto>(user);
    userDto.Roles = roles.ToList();

    return new AuthResponseDto
    {
      Token = tokenHandler.WriteToken(token),
      Expiration = tokenDescriptor.Expires.Value,
      User = userDto
    };
  }
}
