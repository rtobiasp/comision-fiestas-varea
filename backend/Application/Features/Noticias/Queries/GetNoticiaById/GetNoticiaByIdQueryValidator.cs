using FluentValidation;

namespace Application.Features.Noticias.Queries.GetNoticiaById
{
    public class GetNoticiaByIdQueryValidator : AbstractValidator<GetNoticiaByIdQuery>
    {
        public GetNoticiaByIdQueryValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("El Id de la noticia es obligatorio.");
        }
    }
}
