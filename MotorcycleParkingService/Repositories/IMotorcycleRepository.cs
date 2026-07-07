public interface IMotorcycleRepository
{
    Task<Motorcycle?> GetByLicensePlateAsync(string licensePlate);
    Task<Motorcycle> CreateAsync(Motorcycle motorcycle);
}
