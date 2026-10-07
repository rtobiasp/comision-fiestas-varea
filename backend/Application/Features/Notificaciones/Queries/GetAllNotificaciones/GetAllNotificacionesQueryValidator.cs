using FluentValidation;

namespace Application.Features.Notificaciones.Queries.GetAllNotificaciones
{
    public class GetAllNotificacionesQueryValidator : AbstractValidator<GetAllNotificacionesQuery>
    {
        public GetAllNotificacionesQueryValidator()
        {
            RuleFor(x => x.Offset)
                .GreaterThanOrEqualTo(0).When(x => x.Offset.HasValue)
                .WithMessage("El offset debe ser mayor o igual que 0.");

            RuleFor(x => x.Limit)
                .GreaterThanOrEqualTo(1).When(x => x.Limit.HasValue)
                .WithMessage("El limit debe ser mayor o igual que 1.")
                .LessThanOrEqualTo(100).When(x => x.Limit.HasValue)
                .WithMessage("El limit no puede ser mayor que 100.");
        }
    }
}
