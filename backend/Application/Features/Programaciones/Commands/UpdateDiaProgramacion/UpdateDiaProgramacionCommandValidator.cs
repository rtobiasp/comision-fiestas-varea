using FluentValidation;

namespace Application.Features.Programaciones.Commands.UpdateDiaProgramacion
{
    public class UpdateDiaProgramacionCommandValidator : AbstractValidator<UpdateDiaProgramacionCommand>
    {
        public UpdateDiaProgramacionCommandValidator()
        {
            RuleFor(x => x.Id).NotEmpty().WithMessage("El Id del día es obligatorio.");
            RuleFor(x => x.Fecha).NotEmpty().WithMessage("La fecha es obligatoria.");
        }
    }
}
