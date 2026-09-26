using FluentValidation;

namespace Application.Features.Eventos.Queries.GetEventoById
{
    public class GetEventoByIdQueryValidator : AbstractValidator<GetEventoByIdQuery>
    {
        public GetEventoByIdQueryValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("El Id del evento es obligatorio.");
        }
    }
}
