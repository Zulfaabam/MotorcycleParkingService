public interface IParkingRecordRepository
{
    Task<List<ParkingRecord>> GetAllAsync();
    Task<ParkingRecord?> GetByIdAsync(Guid id);
    Task<ParkingRecord> CreateAsync(ParkingRecord parkingRecord);
    Task<ParkingRecord> UpdateAsync(ParkingRecord parkingRecord);
    Task DeleteAsync(Guid id);
    // Task<(List<ParkingRecord> ParkingRecords, int TotalCount)> GetFilteredAsync(string userId, ParkingRecordFilterDto filter);
    Task<bool> ExistsAsync(Guid id);
}