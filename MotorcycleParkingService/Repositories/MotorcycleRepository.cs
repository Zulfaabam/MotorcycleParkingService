using Microsoft.EntityFrameworkCore;

public class MotorcycleRepository : IMotorcycleRepository
{
  private readonly ApplicationDbContext _context;

  public MotorcycleRepository(ApplicationDbContext context)
  {
    _context = context;
  }

  public async Task<Motorcycle?> GetByLicensePlateAsync(string licensePlate)
  {
    return await _context.Motorcycles
        .FirstOrDefaultAsync(m => m.LicensePlate == licensePlate);
  }

  public async Task<Motorcycle> CreateAsync(Motorcycle motorcycle)
  {
    _context.Motorcycles.Add(motorcycle);
    await _context.SaveChangesAsync();
    return motorcycle;
  }
}
