using Application.Common.Validation;
using Domain.Entities;
using FluentValidation;

namespace Application.Features.Notificaciones.Commands.UpdateNotificacion
{
    public class UpdateNotificacionCommandValidator : AbstractValidator<UpdateNotificacionCommand>
    {
        public UpdateNotificacionCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("El Id de la notificación es obligatorio.");

            RuleFor(x => x.Titulo)
                .NotEmpty().WithMessage("El título es obligatorio.")
                .MaximumLength(200).WithMessage("El título no puede exceder los 200 caracteres.")
                .IsPlainText();

            RuleFor(x => x.Mensaje)
                .NotEmpty().WithMessage("El mensaje es obligatorio.")
                .MaximumLength(100000).WithMessage("El mensaje no puede exceder los 100000 caracteres.")
                .IsSafeHtml();

            RuleFor(x => x.Nivel)
                .NotEmpty().WithMessage("El nivel es obligatorio.")
                .Must(n => NivelNotificacion.Permitidos.Contains(n))
                .WithMessage("El nivel debe ser Info, Aviso o Urgente.");

            RuleFor(x => x.CategoriaIds)
                .IsValidCategoriaIds();

            RuleFor(x => x.TagIds)
                .IsValidTagIds();
        }
    }
}
