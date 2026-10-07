using FluentValidation;

namespace Application.Features.Tags.Queries.GetAllTags
{
    public class GetAllTagsQueryValidator : AbstractValidator<GetAllTagsQuery>
    {
        public GetAllTagsQueryValidator()
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
