using FluentValidation;

namespace Application.Features.Tags.Commands.UpdateTag
{
    public class UpdateTagCommandValidator : AbstractValidator<UpdateTagCommand>
    {
        public UpdateTagCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("El Id del tag es obligatorio.");

            RuleFor(x => x.Nombre)
                .NotEmpty().WithMessage("El nombre es obligatorio.")
                .MaximumLength(100).WithMessage("El nombre no puede tener más de 100 caracteres.");
        }
    }
}
