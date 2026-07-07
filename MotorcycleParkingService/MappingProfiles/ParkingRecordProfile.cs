using AutoMapper;

public class ParkingRecordProfile : Profile
{
    public ParkingRecordProfile()
    {
        CreateMap<ParkingRecord, ParkingRecordDto>()
            .ForMember(dest => dest.MotorcycleLicensePlate, opt => opt.MapFrom(src => src.Motorcycle.LicensePlate))
            .ForMember(dest => dest.MotorcycleBrandName, opt => opt.MapFrom(src => src.Motorcycle.Brand.Name));
    }
}