using FluentValidation;

namespace Application.Features.Categorias.Queries.GetCategoriaById
{
    public class GetCategoriaByIdQueryValidator : AbstractValidator<GetCategoriaByIdQuery>
    {
        public GetCategoriaByIdQueryValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("El Id de la categoría es obligatorio.");
        }
    }
}
