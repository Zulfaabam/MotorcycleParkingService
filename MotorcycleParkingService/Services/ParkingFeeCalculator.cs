public interface IParkingFeeCalculator
{
    decimal CalculateFee(DateTimeOffset entryTime, DateTimeOffset exitTime, bool IsNeedWashing);
}

public class ParkingFeeCalculator : IParkingFeeCalculator
{
    private const decimal DayRate = 3000m;
    private const decimal EveningRate = 5000m;
    private const decimal MultiDayRate = 5000m;

    public decimal CalculateFee(DateTimeOffset entryTime, DateTimeOffset exitTime, bool IsNeedWashing)
    {
        // Assuming entryTime and exitTime are already in the correct offset (+07:00)
        var entryDate = entryTime.Date;
        var exitDate = exitTime.Date;

        // Calculate calendar days difference (e.g., Mon to Wed = 2. Add 1 to make it 3 days)
        int calendarDays = (exitDate - entryDate).Days + 1;

        decimal totalFee;

        if (calendarDays == 1)
        {
            // Same day parking
            // Check if exit time is past 6 PM (18:00)
            if (exitTime.Hour >= 18)
            {
                totalFee = EveningRate;
            }
            else
            {
                totalFee = DayRate;
            }
        }
        else
        {
            // Multi-day parking
            totalFee = calendarDays * MultiDayRate;
        }

        if (IsNeedWashing)
        {
          totalFee += 15000m;
        }

        return totalFee;
    }
}
