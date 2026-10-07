using FluentValidation;

namespace Application.Features.Categorias.Queries.GetAllCategorias
{
    public class GetAllCategoriasQueryValidator : AbstractValidator<GetAllCategoriasQuery>
    {
        public GetAllCategoriasQueryValidator()
        {
            RuleFor(x => x.OrderBy)
                .Must(v => v == null || v.Equals("titulo", StringComparison.OrdinalIgnoreCase) || v.Equals("fecha", StringComparison.OrdinalIgnoreCase))
                .WithMessage("OrderBy debe ser 'titulo' o 'fecha'.");

            RuleFor(x => x.Direction)
                .Must(v => v == null || v.Equals("asc", StringComparison.OrdinalIgnoreCase) || v.Equals("desc", StringComparison.OrdinalIgnoreCase))
                .WithMessage("Direction debe ser 'asc' o 'desc'.");
        }
    }
}
