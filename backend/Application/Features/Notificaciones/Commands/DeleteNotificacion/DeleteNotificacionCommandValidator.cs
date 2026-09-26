using FluentValidation;

namespace Application.Features.Notificaciones.Commands.DeleteNotificacion
{
    public class DeleteNotificacionCommandValidator : AbstractValidator<DeleteNotificacionCommand>
    {
        public DeleteNotificacionCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("El Id de la notificación es obligatorio.");
        }
    }
}
