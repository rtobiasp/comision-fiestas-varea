using FluentValidation;

namespace Application.Features.Noticias.Commands.UpdateNoticia
{
    public class UpdateNoticiaCommandValidator : AbstractValidator<UpdateNoticiaCommand>
    {
        public UpdateNoticiaCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("El Id de la noticia es obligatorio.");

            RuleFor(x => x.Titulo)
                .NotEmpty().WithMessage("El título es obligatorio.")
                .MaximumLength(200).WithMessage("El título no puede exceder los 200 caracteres.");

            RuleFor(x => x.Subtitulo)
                .MaximumLength(300).WithMessage("El subtítulo no puede exceder los 300 caracteres.")
                .When(x => !string.IsNullOrEmpty(x.Subtitulo));

            RuleFor(x => x.Contenido)
                .NotEmpty().WithMessage("El contenido es obligatorio.")
                .MaximumLength(2000).WithMessage("El contenido no puede exceder los 2000 caracteres.");
        }
    }
}
