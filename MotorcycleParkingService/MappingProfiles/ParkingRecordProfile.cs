using AutoMapper;

public class ParkingRecordProfile : Profile
{
  public ParkingRecordProfile()
  {
    CreateMap<ParkingRecord, ParkingRecordDto>()
        .ForMember(dest => dest.MotorcycleLicensePlate, opt => opt.MapFrom(src => src.Motorcycle != null ? src.Motorcycle.LicensePlate : string.Empty))
        .ForMember(dest => dest.MotorcycleBrandName, opt => opt.MapFrom(src => src.Motorcycle != null && src.Motorcycle.Brand != null ? src.Motorcycle.Brand.Name : null));

    CreateMap<UpdateParkingRecordDto, ParkingRecord>();
  }
}