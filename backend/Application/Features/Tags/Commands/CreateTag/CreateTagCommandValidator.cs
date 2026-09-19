using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Features.Tags.Commands.CreateTag
{
    public class CreateTagCommandValidator : AbstractValidator<CreateTagCommand>
    {
        public CreateTagCommandValidator()
        {
            RuleFor(x => x.Nombre)
                .NotEmpty().WithMessage("El nombre es obligatorio.")
                .MaximumLength(100).WithMessage("El nombre no puede tener más de 100 caracteres.");
        }
    }
}
