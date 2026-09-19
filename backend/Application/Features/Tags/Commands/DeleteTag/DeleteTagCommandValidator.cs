using FluentValidation;

namespace Application.Features.Tags.Commands.DeleteTag
{
    public class DeleteTagCommandValidator : AbstractValidator<DeleteTagCommand>
    {
        public DeleteTagCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("El Id del tag es obligatorio.");
        }
    }
}
