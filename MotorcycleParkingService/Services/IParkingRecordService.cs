public interface IParkingRecordService
{
    Task<ApiResponseDto<List<ParkingRecordDto>>> GetAllAsync();
    Task<ApiResponseDto<ParkingRecordDto>> GetByIdAsync(Guid id);
    Task<ApiResponseDto<ParkingRecordDto>> CreateAsync(CreateParkingRecordDto createDto);
    Task<ApiResponseDto<ParkingRecordDto>> UpdateAsync(Guid id, UpdateParkingRecordDto updateDto);
    Task<ApiResponseDto<bool>> DeleteAsync(Guid id);
    // Task<ApiResponseDto<PaginatedResultDto<ParkingRecordDto>>> GetFilteredAsync(string userId, TodoItemFilterDto filter);
}