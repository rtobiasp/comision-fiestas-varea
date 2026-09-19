using FluentValidation;

namespace Application.Features.Categorias.Commands.DeleteCategoria
{
    public class DeleteCategoriaCommandValidator : AbstractValidator<DeleteCategoriaCommand>
    {
        public DeleteCategoriaCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("El Id de la categoría es obligatorio.");
        }
    }
}
