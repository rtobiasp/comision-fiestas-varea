using Application.Common.Validation;
using FluentValidation;

namespace Application.Features.Noticias.Commands.CreateNoticia
{
    public class CreateNoticiaCommandValidator : AbstractValidator<CreateNoticiaCommand>
    {
        public CreateNoticiaCommandValidator()
        {
            RuleFor(x => x.Titulo)
                .NotEmpty().WithMessage("El título es obligatorio.")
                .MaximumLength(200).WithMessage("El título no puede exceder los 200 caracteres.")
                .IsPlainText();

            RuleFor(x => x.Subtitulo)
                .MaximumLength(300).WithMessage("El subtítulo no puede exceder los 300 caracteres.")
                .IsPlainText()
                .When(x => !string.IsNullOrEmpty(x.Subtitulo));

            RuleFor(x => x.Contenido)
                .NotEmpty().WithMessage("El contenido es obligatorio.")
                .MaximumLength(2000).WithMessage("El contenido no puede exceder los 2000 caracteres.")
                .IsSafeHtml();

         }
    }
}
