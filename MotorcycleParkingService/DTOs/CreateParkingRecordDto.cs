public class CreateParkingRecordDto
{
    public string MotorcycleLicensePlate { get; set; } = string.Empty;

    public bool IsNeedWashing { get; set; }

    public string? Notes { get; set; }
}