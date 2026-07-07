using FluentValidation;

public class CreateParkingRecordValidator : AbstractValidator<CreateParkingRecordDto>
{
    public CreateParkingRecordValidator()
    {
        RuleFor(p => p.MotorcycleLicensePlate)
            .NotEmpty().WithMessage("License plate cannot be empty");

        RuleFor(p => p.EntryTime)
            .NotEmpty().WithMessage("Entry time cannot be empty");
    }
}