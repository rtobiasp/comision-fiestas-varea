using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Features.Categorias.Commands.CreateCategoria
{
    public class CreateCategoriaCommandValidator : AbstractValidator<CreateCategoriaCommand>
    {
        public CreateCategoriaCommandValidator()
        {
            RuleFor(x => x.Nombre)
                .NotEmpty().WithMessage("El nombre es obligatorio.")
                .MaximumLength(100).WithMessage("El nombre no puede tener más de 100 caracteres.");

            RuleFor(x => x.Descripcion)
                .MaximumLength(250).WithMessage("La descripción no puede tener más de 250 caracteres.");

            RuleFor(x => x.CategoriaPadreId)
                .Must(id => id.HasValue && id.Value != Guid.Empty).WithMessage("El Id de la categoría padre no es válido.")
                .When(x => x.CategoriaPadreId.HasValue);
        }
    }
}
