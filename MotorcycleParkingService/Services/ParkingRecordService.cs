using AutoMapper;

public class ParkingRecordService : IParkingRecordService
{
  private readonly IParkingRecordRepository _repository;
  private readonly IMotorcycleRepository _motorcycleRepository;
  private readonly IParkingFeeCalculator _feeCalculator;
  private readonly IMapper _mapper;

  public ParkingRecordService(
      IParkingRecordRepository repository,
      IMotorcycleRepository motorcycleRepository,
      IMapper mapper,
      IParkingFeeCalculator feeCalculator)
  {
    _repository = repository;
    _motorcycleRepository = motorcycleRepository;
    _mapper = mapper;
    _feeCalculator = feeCalculator;
  }

  public async Task<ApiResponseDto<List<ParkingRecordDto>>> GetAllAsync()
  {
    try
    {
      List<ParkingRecord> parkingRecords = await _repository.GetAllAsync();
      List<ParkingRecordDto> parkingRecordDtos = _mapper.Map<List<ParkingRecordDto>>(parkingRecords);

      return ApiResponseDto<List<ParkingRecordDto>>.SuccessResult(parkingRecordDtos, "Successfully retrieved parking record list");
    }
    catch( Exception ex )
    {
      return ApiResponseDto<List<ParkingRecordDto>>.ErrorResult($"Error retrieving parking record list: {ex.Message}");
    }
  }

  public async Task<ApiResponseDto<ParkingRecordDto>> GetByIdAsync(Guid id)
  {
    try
    {
      ParkingRecord? parkingRecord = await _repository.GetByIdAsync(id);

      if( parkingRecord == null )
      {
        return ApiResponseDto<ParkingRecordDto>.ErrorResult($"Parking record details not found");
      }

      ParkingRecordDto parkingRecordDto = _mapper.Map<ParkingRecordDto>(parkingRecord);

      return ApiResponseDto<ParkingRecordDto>.SuccessResult(parkingRecordDto, "Successfully retrieved parking record");
    }
    catch( Exception ex )
    {
      return ApiResponseDto<ParkingRecordDto>.ErrorResult($"Could not get parking record details: {ex.Message}");
    }
  }

  public async Task<ApiResponseDto<ParkingRecordDto>> CreateAsync(CreateParkingRecordDto createDto)
  {
    try
    {
      string normalizedPlate = createDto.MotorcycleLicensePlate.Trim().ToUpper();
      Motorcycle? motorcycle = await _motorcycleRepository.GetByLicensePlateAsync(normalizedPlate);

      if( motorcycle == null )
      {
        motorcycle = new Motorcycle
        {
          Id = Guid.NewGuid(),
          LicensePlate = normalizedPlate
        };
        await _motorcycleRepository.CreateAsync(motorcycle);
      }

      ParkingRecord parkingRecord = new ParkingRecord
      {
        Id = Guid.NewGuid(),
        MotorcycleId = motorcycle.Id,
        EntryTime = DateTimeOffset.Now,
        IsNeedWashing = createDto.IsNeedWashing,
        EstimatedFee = _feeCalculator.CalculateFee(DateTimeOffset.Now, DateTimeOffset.Now, createDto.IsNeedWashing),
        Notes = createDto.Notes
      };

      ParkingRecord createdParkingRecord = await _repository.CreateAsync(parkingRecord);
      ParkingRecordDto parkingRecordDto = _mapper.Map<ParkingRecordDto>(createdParkingRecord);

      return ApiResponseDto<ParkingRecordDto>.SuccessResult(parkingRecordDto, "Successfully added parking record");
    }
    catch( Exception ex )
    {
      return ApiResponseDto<ParkingRecordDto>.ErrorResult($"Could not create parking record: {ex.Message}");
    }
  }

  public async Task<ApiResponseDto<ParkingRecordDto>> UpdateAsync(Guid id, UpdateParkingRecordDto updateDto)
  {
    try
    {
      ParkingRecord? existingParkingRecord = await _repository.GetByIdAsync(id);

      if( existingParkingRecord == null )
      {
        return ApiResponseDto<ParkingRecordDto>.ErrorResult("Parking record not found");
      }

      string normalizedPlate = updateDto.MotorcycleLicensePlate.Trim().ToUpper();
      Motorcycle? motorcycle = await _motorcycleRepository.GetByLicensePlateAsync(normalizedPlate);

      if( motorcycle == null )
      {
        motorcycle = new Motorcycle
        {
          Id = Guid.NewGuid(),
          LicensePlate = normalizedPlate
        };
        await _motorcycleRepository.CreateAsync(motorcycle);
      }

      _mapper.Map(updateDto, existingParkingRecord);

      existingParkingRecord.MotorcycleId = motorcycle.Id;

      DateTimeOffset timeToCalculateAgainst = existingParkingRecord.ExitTime ?? DateTimeOffset.Now;
      existingParkingRecord.EstimatedFee = _feeCalculator.CalculateFee(
          existingParkingRecord.EntryTime,
          timeToCalculateAgainst,
          existingParkingRecord.IsNeedWashing);

      ParkingRecord updatedParkingRecord = await _repository.UpdateAsync(existingParkingRecord);
      ParkingRecordDto parkingRecordDto = _mapper.Map<ParkingRecordDto>(updatedParkingRecord);

      return ApiResponseDto<ParkingRecordDto>.SuccessResult(parkingRecordDto, "Successfully updated parking record");
    }
    catch( Exception ex )
    {
      return ApiResponseDto<ParkingRecordDto>.ErrorResult($"Could not update parking record: {ex.Message}");
    }
  }

  public async Task<ApiResponseDto<bool>> DeleteAsync(Guid id)
  {
    try
    {
      bool isExist = await _repository.ExistsAsync(id);

      if( !isExist )
      {
        return ApiResponseDto<bool>.ErrorResult("Parking record not found");
      }

      await _repository.DeleteAsync(id);
      return ApiResponseDto<bool>.SuccessResult(true, "Successfully deleted parking record");
    }
    catch( Exception ex )
    {
      return ApiResponseDto<bool>.ErrorResult($"Could not delete parking record: {ex.Message}");
    }
  }
}