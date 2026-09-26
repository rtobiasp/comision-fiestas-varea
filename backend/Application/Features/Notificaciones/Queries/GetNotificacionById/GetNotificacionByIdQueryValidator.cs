using FluentValidation;

namespace Application.Features.Notificaciones.Queries.GetNotificacionById
{
    public class GetNotificacionByIdQueryValidator : AbstractValidator<GetNotificacionByIdQuery>
    {
        public GetNotificacionByIdQueryValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("El Id de la notificación es obligatorio.");
        }
    }
}
