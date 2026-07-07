using Microsoft.AspNetCore.Identity;

public class ApplicationUser : IdentityUser
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<ParkingRecord> ParkingRecords { get; set; } = new List<ParkingRecord>();
}