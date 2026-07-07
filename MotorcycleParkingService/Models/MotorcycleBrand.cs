using System.ComponentModel.DataAnnotations;

public class MotorcycleBrand
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; }

    public ICollection<Motorcycle> Motorcycles { get; set; } = new List<Motorcycle>();
}