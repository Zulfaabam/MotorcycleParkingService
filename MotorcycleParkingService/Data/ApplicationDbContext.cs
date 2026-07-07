using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<Motorcycle> Motorcycles { get; set; }
    public DbSet<MotorcycleBrand> MotorcycleBrands { get; set; }
    public DbSet<ParkingRecord> ParkingRecords { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Motorcycle>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.LicensePlate)
                .IsRequired()
                .HasMaxLength(20);

            entity.HasIndex(e => e.LicensePlate)
                .IsUnique();

            entity.HasOne(e => e.Brand)
                .WithMany(b => b.Motorcycles)
                .HasForeignKey(e => e.BrandId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        builder.Entity<MotorcycleBrand>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(100);
        });

        builder.Entity<ParkingRecord>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.EstimatedFee)
                .HasPrecision(18, 2);

            entity.HasOne(e => e.Motorcycle)
                .WithMany(m => m.ParkingRecords)
                .HasForeignKey(e => e.MotorcycleId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}