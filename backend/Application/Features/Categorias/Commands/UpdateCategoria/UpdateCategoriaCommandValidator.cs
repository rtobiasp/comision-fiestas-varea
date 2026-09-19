using FluentValidation;

namespace Application.Features.Categorias.Commands.UpdateCategoria
{
    public class UpdateCategoriaCommandValidator : AbstractValidator<UpdateCategoriaCommand>
    {
        public UpdateCategoriaCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("El Id de la categoría es obligatorio.");

            RuleFor(x => x.Nombre)
                .NotEmpty().WithMessage("El nombre es obligatorio.")
                .MaximumLength(100).WithMessage("El nombre no puede tener más de 100 caracteres.");

            RuleFor(x => x.Descripcion)
                .MaximumLength(250).WithMessage("La descripción no puede tener más de 250 caracteres.");
        }
    }
}
