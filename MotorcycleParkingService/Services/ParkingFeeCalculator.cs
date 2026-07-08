public interface IParkingFeeCalculator
{
  decimal CalculateFee(DateTimeOffset entryTime, DateTimeOffset exitTime, bool IsNeedWashing);
}

public class ParkingFeeCalculator : IParkingFeeCalculator
{
  private const decimal DAY_RATE = 3000m;
  private const decimal EVENING_RATE = 5000m;
  private const decimal MULTI_DAY_RATE = 5000m;

  public decimal CalculateFee(DateTimeOffset entryTime, DateTimeOffset exitTime, bool IsNeedWashing)
  {
    DateTime entryDate = entryTime.Date;
    DateTime exitDate = exitTime.Date;

    // Calculate calendar days difference 
    // (e.g., Mon to Wed = 2. Add 1 to make it 3 days)
    int calendarDays = ( exitDate - entryDate ).Days + 1;

    decimal totalFee;

    if( calendarDays == 1 )
    {
      // Same day parking
      // Check if exit time is past 6 PM (18:00)
      if( exitTime.Hour >= 18 )
      {
        totalFee = EVENING_RATE;
      }
      else
      {
        totalFee = DAY_RATE;
      }
    }
    else
    {
      // Multi-day parking
      totalFee = calendarDays * MULTI_DAY_RATE;
    }

    if( IsNeedWashing )
    {
      totalFee += 15000m;
    }

    return totalFee;
  }
}
