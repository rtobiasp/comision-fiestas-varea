using FluentValidation;

namespace Application.Features.Media.Commands.DeleteMedia
{
    public class DeleteMediaCommandValidator : AbstractValidator<DeleteMediaCommand>
    {
        public DeleteMediaCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("El id es obligatorio.");
        }
    }
}
