using FluentValidation;

namespace Application.Features.Programaciones.Queries.GetProgramacionById
{
    public class GetProgramacionByIdQueryValidator : AbstractValidator<GetProgramacionByIdQuery>
    {
        public GetProgramacionByIdQueryValidator()
        {
            RuleFor(x => x.Id).NotEmpty().WithMessage("El Id de la programación es obligatorio.");
        }
    }
}
