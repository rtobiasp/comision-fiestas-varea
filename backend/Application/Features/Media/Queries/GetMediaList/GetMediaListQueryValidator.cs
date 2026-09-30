using FluentValidation;

namespace Application.Features.Media.Queries.GetMediaList
{
    public class GetMediaListQueryValidator : AbstractValidator<GetMediaListQuery>
    {
        public GetMediaListQueryValidator()
        {
            RuleFor(x => x.Tipo)
                .IsInEnum().When(x => x.Tipo.HasValue)
                .WithMessage("El tipo debe ser un valor válido.");

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
