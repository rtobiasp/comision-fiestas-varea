using Application.Common.Validation;
using FluentValidation;

namespace Application.Features.Media.Commands.UpdateMedia
{
    public class UpdateMediaCommandValidator : AbstractValidator<UpdateMediaCommand>
    {
        public UpdateMediaCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("El Id del archivo multimedia es obligatorio.");

            RuleFor(x => x.NombreOriginal)
                .NotEmpty().WithMessage("El título es obligatorio.")
                .IsNotBlank()
                .MaximumLength(255).WithMessage("El título no puede exceder los 255 caracteres.")
                .IsPlainText();

            RuleFor(x => x.AltText)
                .MaximumLength(300).WithMessage("El texto alternativo no puede exceder los 300 caracteres.")
                .IsPlainText()
                .When(x => !string.IsNullOrWhiteSpace(x.AltText));
        }
    }
}
