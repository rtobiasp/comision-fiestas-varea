using FluentValidation;

namespace Application.Features.Programaciones.Queries.GetEventoProgramacionById
{
    public class GetEventoProgramacionByIdQueryValidator : AbstractValidator<GetEventoProgramacionByIdQuery>
    {
        public GetEventoProgramacionByIdQueryValidator()
        {
            RuleFor(x => x.Id).NotEmpty().WithMessage("El Id del evento es obligatorio.");
        }
    }
}
