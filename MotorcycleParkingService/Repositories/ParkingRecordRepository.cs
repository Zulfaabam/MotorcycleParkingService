using Microsoft.EntityFrameworkCore;

public class ParkingRecordRepository : IParkingRecordRepository
{
    private readonly ApplicationDbContext _context;

    public ParkingRecordRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<ParkingRecord>> GetAllAsync()
    {
        return await _context.ParkingRecords
            .Include(p => p.Motorcycle)
            // .OrderByDescending(p => p.EntryTime)
            .ToListAsync();
    }

    public async Task<ParkingRecord?> GetByIdAsync(Guid id)
    {
        return await _context.ParkingRecords
            .Include(p => p.Motorcycle)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<ParkingRecord> CreateAsync(ParkingRecord parkingRecord)
    {
        _context.ParkingRecords.Add(parkingRecord);
        await _context.SaveChangesAsync();

        // Load the user information
        // await _context.Entry(parkingRecord)
        //     .Reference(t => t.User)
        //     .LoadAsync();

        return parkingRecord;
    }

    public async Task<ParkingRecord> UpdateAsync(ParkingRecord parkingRecord)
    {
        _context.ParkingRecords.Update(parkingRecord);
        await _context.SaveChangesAsync();

        // Load the user information
        // await _context.Entry(parkingRecord)
        //     .Reference(t => t.User)
        //     .LoadAsync();

        return parkingRecord;
    }

    public async Task DeleteAsync(Guid id)
    {
        var parkingRecord = await _context.ParkingRecords
                .FirstOrDefaultAsync(t => t.Id == id);

        if (parkingRecord != null)
        {
            _context.ParkingRecords.Remove(parkingRecord);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(Guid id)
    {
        return await _context.ParkingRecords.AnyAsync(t => t.Id == id);
    }
}