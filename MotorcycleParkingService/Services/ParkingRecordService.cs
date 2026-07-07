using AutoMapper;
using SQLitePCL;

public class ParkingRecordService : IParkingRecordService
{
    private readonly IParkingRecordRepository _repository;
    private readonly IMapper _mapper;

    public ParkingRecordService(IParkingRecordRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<ApiResponseDto<List<ParkingRecordDto>>> GetAllAsync()
    {
        try
        {
            var parkingRecords = await _repository.GetAllAsync();
            var parkingRecordDtos = _mapper.Map<List<ParkingRecordDto>>(parkingRecords);

            return ApiResponseDto<List<ParkingRecordDto>>.SuccessResult(parkingRecordDtos, "Successfully retrieved parking record list");
        }
        catch (Exception ex)
        {
            return ApiResponseDto<List<ParkingRecordDto>>.ErrorResult($"Error retrieving parking list: {ex.Message}");
        }
    }

    public async Task<ApiResponseDto<ParkingRecordDto>> GetByIdAsync(Guid id)
    {
        try
        {
            var parkingRecord = await _repository.GetByIdAsync(id);

            if (parkingRecord == null)
            {
                return ApiResponseDto<ParkingRecordDto>.ErrorResult($"Parking details not found");
            }

            var parkingRecordDto = _mapper.Map<ParkingRecordDto>(parkingRecord);

            return ApiResponseDto<ParkingRecordDto>.SuccessResult(parkingRecordDto, "Successfully retrieved parking record");
        }
        catch (Exception ex)
        {
            return ApiResponseDto<ParkingRecordDto>.ErrorResult($"Could not get parking details: {ex.Message}");
        }
    }

    public async Task<ApiResponseDto<ParkingRecordDto>> CreateAsync(CreateParkingRecordDto createDto)
    {
        try
        {
            var parkingRecord = _mapper.Map<ParkingRecord>(createDto);

            var createdParkingRecord = await _repository.CreateAsync(parkingRecord);
            var parkingRecordDto = _mapper.Map<ParkingRecordDto>(createdParkingRecord);

            return ApiResponseDto<ParkingRecordDto>.SuccessResult(parkingRecordDto, "Successfully added parking record");
        }
        catch (Exception ex)
        {
            return ApiResponseDto<ParkingRecordDto>.ErrorResult($"Could not create parking record: {ex.Message}");
        }
    }

    public async Task<ApiResponseDto<ParkingRecordDto>> UpdateAsync(Guid id, UpdateParkingRecordDto updateDto)
    {
        try
        {
            var existingParkingRecord = await _repository.GetByIdAsync(id);

            if (existingParkingRecord == null)
            {
                return ApiResponseDto<ParkingRecordDto>.ErrorResult("Parking record not found");
            }

            _mapper.Map(updateDto, existingParkingRecord);

            var updatedParkingRecord = await _repository.UpdateAsync(existingParkingRecord);
            var parkingRecordDto = _mapper.Map<ParkingRecordDto>(updatedParkingRecord);

            return ApiResponseDto<ParkingRecordDto>.SuccessResult(parkingRecordDto, "Successfully updated parking record");
        }
        catch (Exception ex)
        {
            return ApiResponseDto<ParkingRecordDto>.ErrorResult($"Could not update parking record: {ex.Message}");
        }
    }

    public async Task<ApiResponseDto<bool>> DeleteAsync(Guid id)
    {
        try
        {
            var isExist = await _repository.ExistsAsync(id);

            if (!isExist)
            {
                return ApiResponseDto<bool>.ErrorResult("Parking record not found");
            }

            await _repository.DeleteAsync(id);
            return ApiResponseDto<bool>.SuccessResult(true, "Successfully deleted parking record");
        }
        catch (Exception ex)
        {
            return ApiResponseDto<bool>.ErrorResult($"Could not delete parking record: {ex.Message}");
        }
    }
}