using Application.Common.Validation;
using FluentValidation;

namespace Application.Features.Programaciones.Commands.CreateProgramacion
{
    public class CreateProgramacionCommandValidator : AbstractValidator<CreateProgramacionCommand>
    {
        public CreateProgramacionCommandValidator()
        {
            RuleFor(x => x.Nombre).NotEmpty().WithMessage("El nombre es obligatorio.")
                .MaximumLength(200).WithMessage("El nombre no puede exceder los 200 caracteres.")
                .IsPlainText();
        }
    }
}
