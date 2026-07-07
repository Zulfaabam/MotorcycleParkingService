using System.ComponentModel.DataAnnotations;

public class Motorcycle
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    [MaxLength(20)]
    public string LicensePlate { get; set; }

    public Guid? BrandId { get; set; }

    public MotorcycleBrand? Brand { get; set; }

    public ICollection<ParkingRecord> ParkingRecords { get; set; } = new List<ParkingRecord>();
}