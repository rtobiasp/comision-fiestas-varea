using FluentValidation;

namespace Application.Features.Tags.Queries.GetTagById
{
    public class GetTagByIdQueryValidator : AbstractValidator<GetTagByIdQuery>
    {
        public GetTagByIdQueryValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("El Id del tag es obligatorio.");
        }
    }
}
