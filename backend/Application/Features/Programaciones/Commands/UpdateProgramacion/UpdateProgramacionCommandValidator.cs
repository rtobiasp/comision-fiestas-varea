using Application.Common.Validation;
using FluentValidation;

namespace Application.Features.Programaciones.Commands.UpdateProgramacion
{
    public class UpdateProgramacionCommandValidator : AbstractValidator<UpdateProgramacionCommand>
    {
        public UpdateProgramacionCommandValidator()
        {
            RuleFor(x => x.Id).NotEmpty().WithMessage("El Id de la programación es obligatorio.");
            RuleFor(x => x.Nombre).NotEmpty().WithMessage("El nombre es obligatorio.")
                .MaximumLength(200).WithMessage("El nombre no puede exceder los 200 caracteres.")
                .IsPlainText();
        }
    }
}
