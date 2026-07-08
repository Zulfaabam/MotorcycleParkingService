using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ParkingRecordsController : ControllerBase
{
    private readonly IParkingRecordService _parkingRecordService;
    private readonly IValidator<CreateParkingRecordDto> _createValidator;
    private readonly IValidator<UpdateParkingRecordDto> _updateValidator;

    public ParkingRecordsController(
        IParkingRecordService parkingRecordService,
        IValidator<CreateParkingRecordDto> createValidator,
        IValidator<UpdateParkingRecordDto> updateValidator
    )
    {
        _parkingRecordService = parkingRecordService;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        ApiResponseDto<List<ParkingRecordDto>> result = await _parkingRecordService.GetAllAsync();

        if( !result.Success )
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        ApiResponseDto<ParkingRecordDto> result = await _parkingRecordService.GetByIdAsync(id);

        if( !result.Success )
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateParkingRecordDto createDto)
    {
        ValidationResult validationResult = await _createValidator.ValidateAsync(createDto);

        if( !validationResult.IsValid )
        {
            List<string>? errors = validationResult.Errors.Select(e => e.ErrorMessage).ToList();
            var errorResponse = ApiResponseDto<CreateParkingRecordDto>.ErrorResult("Validation failed", errors);
            return BadRequest(errorResponse);
        }

        ApiResponseDto<ParkingRecordDto> result = await _parkingRecordService.CreateAsync(createDto);

        if( !result.Success )
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateParkingRecordDto updateDto)
    {
        ValidationResult validationResult = await _updateValidator.ValidateAsync(updateDto);

        if( !validationResult.IsValid )
        {
            List<string>? errors = validationResult.Errors.Select(e => e.ErrorMessage).ToList();
            var errorResponse = ApiResponseDto<UpdateParkingRecordDto>.ErrorResult("Validation failed", errors);
            return BadRequest(errorResponse);
        }

        ApiResponseDto<ParkingRecordDto> result = await _parkingRecordService.UpdateAsync(id, updateDto);

        if( !result.Success )
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        ApiResponseDto<bool> result = await _parkingRecordService.DeleteAsync(id);

        if( !result.Success )
        {
            return BadRequest(result);
        }

        return Ok(result);
    }
}