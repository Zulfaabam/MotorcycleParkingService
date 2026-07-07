public class ParkingRecordDto
{
    public Guid Id { get; set; }

    public string MotorcycleLicensePlate { get; set; } = string.Empty;

    public string? MotorcycleBrandName { get; set; } 

    public DateTimeOffset EntryTime { get; set; }

    public DateTimeOffset? ExitTime { get; set; }

    public decimal EstimatedFee { get; set; }

    public bool IsNeedWashing { get; set; }

    public string? Notes { get; set; }
}