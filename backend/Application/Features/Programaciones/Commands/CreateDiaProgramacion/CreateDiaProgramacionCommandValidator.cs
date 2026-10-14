using FluentValidation;

namespace Application.Features.Programaciones.Commands.CreateDiaProgramacion
{
    public class CreateDiaProgramacionCommandValidator : AbstractValidator<CreateDiaProgramacionCommand>
    {
        public CreateDiaProgramacionCommandValidator()
        {
            RuleFor(x => x.ProgramacionId).NotEmpty().WithMessage("El Id de la programación es obligatorio.");
            RuleFor(x => x.Fecha).NotEmpty().WithMessage("La fecha es obligatoria.");
        }
    }
}
