using FluentValidation;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
  private readonly IAuthService _authService;
  // private readonly IValidator<RegisterDto> _registerValidator;
  private readonly IValidator<LoginDto> _loginValidator;

  public AuthController(
      IAuthService authService,
      // IValidator<RegisterDto> registerValidator,
      IValidator<LoginDto> loginValidator)
  {
    _authService = authService;
    // _registerValidator = registerValidator;
    _loginValidator = loginValidator;
  }

  // [HttpPost("register")]
  // public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
  // {
  //     var validationResult = await _registerValidator.ValidateAsync(registerDto);
  //     if (!validationResult.IsValid)
  //     {
  //         var errors = validationResult.Errors.Select(e => e.ErrorMessage).ToList();
  //         var errorResponse = ApiResponseDto<AuthResponseDto>.ErrorResult("Validation failed", errors);
  //         return BadRequest(errorResponse);
  //     }

  //     var result = await _authService.RegisterAsync(registerDto);

  //     if (!result.Success)
  //     {
  //         return BadRequest(result);
  //     }

  //     return Ok(result);
  // }

  [HttpPost("login")]
  public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
  {
    var validationResult = await _loginValidator.ValidateAsync(loginDto);
    if (!validationResult.IsValid)
    {
      var errors = validationResult.Errors.Select(e => e.ErrorMessage).ToList();
      var errorResponse = ApiResponseDto<AuthResponseDto>.ErrorResult("Validation failed", errors);
      return BadRequest(errorResponse);
    }

    var result = await _authService.LoginAsync(loginDto);

    if (!result.Success)
    {
      return BadRequest(result);
    }

    return Ok(result);
  }

  /// <summary>
  /// Get current user information
  /// </summary>
  /// <returns>Current user details</returns>
  [HttpGet("me")]
  [Microsoft.AspNetCore.Authorization.Authorize]
  public async Task<IActionResult> GetCurrentUser()
  {
    var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

    if (string.IsNullOrEmpty(userId))
    {
      return Unauthorized();
    }

    var result = await _authService.GetCurrentUserAsync(userId);

    if (!result.Success)
    {
      return BadRequest(result);
    }

    return Ok(result);
  }
}