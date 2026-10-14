using FluentValidation;

namespace Application.Features.Programaciones.Commands.DeleteEventoProgramacion
{
    public class DeleteEventoProgramacionCommandValidator : AbstractValidator<DeleteEventoProgramacionCommand>
    {
        public DeleteEventoProgramacionCommandValidator()
        {
            RuleFor(x => x.Id).NotEmpty().WithMessage("El Id del evento es obligatorio.");
        }
    }
}
