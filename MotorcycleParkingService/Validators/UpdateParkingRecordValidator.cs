using FluentValidation;

public class UpdateParkingRecordValidator : AbstractValidator<UpdateParkingRecordDto>
{
    public UpdateParkingRecordValidator()
    {
        RuleFor(p => p.MotorcycleLicensePlate)
            .NotEmpty().WithMessage("License plate cannot be empty");

        RuleFor(p => p.EntryTime)
            .NotEmpty().WithMessage("Entry time cannot be empty");
    }
}