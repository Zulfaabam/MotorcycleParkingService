using System.Security.Claims;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
  private readonly IAuthService _authService;
  private readonly IValidator<RegisterDto> _registerValidator;
  private readonly IValidator<LoginDto> _loginValidator;

  public AuthController(
      IAuthService authService,
      IValidator<RegisterDto> registerValidator,
      IValidator<LoginDto> loginValidator)
  {
    _authService = authService;
    _registerValidator = registerValidator;
    _loginValidator = loginValidator;
  }

  [HttpPost("register")]
  public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
  {
    ValidationResult validationResult = await _registerValidator.ValidateAsync(registerDto);
    if( !validationResult.IsValid )
    {
      List<string>? errors = validationResult.Errors.Select(e => e.ErrorMessage).ToList();
      var errorResponse = ApiResponseDto<AuthResponseDto>.ErrorResult("Validation failed", errors);
      return BadRequest(errorResponse);
    }

    ApiResponseDto<AuthResponseDto> result = await _authService.RegisterAsync(registerDto);

    if( !result.Success )
    {
      return BadRequest(result);
    }

    return Ok(result);
  }

  [HttpPost("login")]
  public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
  {
    ValidationResult validationResult = await _loginValidator.ValidateAsync(loginDto);
    if( !validationResult.IsValid )
    {
      List<string>? errors = validationResult.Errors.Select(e => e.ErrorMessage).ToList();
      var errorResponse = ApiResponseDto<AuthResponseDto>.ErrorResult("Validation failed", errors);
      return BadRequest(errorResponse);
    }

    ApiResponseDto<AuthResponseDto> result = await _authService.LoginAsync(loginDto);

    if( !result.Success )
    {
      return BadRequest(result);
    }

    return Ok(result);
  }

  [HttpGet("me")]
  [Authorize]
  public async Task<IActionResult> GetCurrentUser()
  {
    string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

    if( string.IsNullOrEmpty(userId) )
    {
      return Unauthorized();
    }

    ApiResponseDto<UserDto> result = await _authService.GetCurrentUserAsync(userId);

    if( !result.Success )
    {
      return BadRequest(result);
    }

    return Ok(result);
  }
}