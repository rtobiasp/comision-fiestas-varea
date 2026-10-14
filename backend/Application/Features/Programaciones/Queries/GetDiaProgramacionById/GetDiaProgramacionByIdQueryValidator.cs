using FluentValidation;

namespace Application.Features.Programaciones.Queries.GetDiaProgramacionById
{
    public class GetDiaProgramacionByIdQueryValidator : AbstractValidator<GetDiaProgramacionByIdQuery>
    {
        public GetDiaProgramacionByIdQueryValidator()
        {
            RuleFor(x => x.Id).NotEmpty().WithMessage("El Id del día es obligatorio.");
        }
    }
}
