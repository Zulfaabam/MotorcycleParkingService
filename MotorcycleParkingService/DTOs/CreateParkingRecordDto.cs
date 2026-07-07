public class CreateParkingRecordDto
{
    public string MotorcycleLicensePlate { get; set; } = string.Empty;

    public DateTimeOffset EntryTime { get; set; }

    public bool IsNeedWashing { get; set; }
}