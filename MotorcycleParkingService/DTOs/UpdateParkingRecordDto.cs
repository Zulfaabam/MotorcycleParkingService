public class UpdateParkingRecordDto
{
    public string LicensePlate { get; set; } = string.Empty;

    public DateTimeOffset ExitTime { get; set; }

    public decimal EstimatedFee { get; set; }

    public bool IsNeedWashing { get; set; }
}