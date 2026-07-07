using System.ComponentModel.DataAnnotations;

public class ParkingRecord
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid MotorcycleId { get; set; }

    public Motorcycle Motorcycle { get; set; } = null!;

    [Required]
    public DateTimeOffset EntryTime { get; set; }

    public DateTimeOffset? ExitTime { get; set; }

    public decimal EstimatedFee { get; set; }

    public bool IsNeedWashing { get; set; }

    public string? Notes { get; set; }
}