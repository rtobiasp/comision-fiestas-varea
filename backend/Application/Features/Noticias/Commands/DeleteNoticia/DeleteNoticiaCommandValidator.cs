using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Features.Noticias.Commands.DeleteNoticia
{
    public class DeleteNoticiaCommandValidator : AbstractValidator<DeleteNoticiaCommand>
    {
        public DeleteNoticiaCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("El Id de la noticia es obligatorio.");
        }
    }
}
