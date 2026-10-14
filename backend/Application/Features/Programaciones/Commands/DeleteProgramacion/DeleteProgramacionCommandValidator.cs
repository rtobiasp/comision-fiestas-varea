using FluentValidation;

namespace Application.Features.Programaciones.Commands.DeleteProgramacion
{
    public class DeleteProgramacionCommandValidator : AbstractValidator<DeleteProgramacionCommand>
    {
        public DeleteProgramacionCommandValidator()
        {
            RuleFor(x => x.Id).NotEmpty().WithMessage("El Id de la programación es obligatorio.");
        }
    }
}
