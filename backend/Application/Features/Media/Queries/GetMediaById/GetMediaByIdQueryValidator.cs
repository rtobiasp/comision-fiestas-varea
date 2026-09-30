using FluentValidation;

namespace Application.Features.Media.Queries.GetMediaById
{
    public class GetMediaByIdQueryValidator : AbstractValidator<GetMediaByIdQuery>
    {
        public GetMediaByIdQueryValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("El id es obligatorio.");
        }
    }
}
