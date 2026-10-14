using FluentValidation;

namespace Application.Features.Programaciones.Commands.DeleteDiaProgramacion
{
    public class DeleteDiaProgramacionCommandValidator : AbstractValidator<DeleteDiaProgramacionCommand>
    {
        public DeleteDiaProgramacionCommandValidator()
        {
            RuleFor(x => x.Id).NotEmpty().WithMessage("El Id del día es obligatorio.");
        }
    }
}
