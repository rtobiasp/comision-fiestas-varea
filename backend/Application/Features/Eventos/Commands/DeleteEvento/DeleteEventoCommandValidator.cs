using FluentValidation;

namespace Application.Features.Eventos.Commands.DeleteEvento
{
    public class DeleteEventoCommandValidator : AbstractValidator<DeleteEventoCommand>
    {
        public DeleteEventoCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("El Id del evento es obligatorio.");
        }
    }
}
