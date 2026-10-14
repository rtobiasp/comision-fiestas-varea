using Application.Common.Validation;
using FluentValidation;

namespace Application.Features.Programaciones.Commands.CreateEventoProgramacion
{
    public class CreateEventoProgramacionCommandValidator : AbstractValidator<CreateEventoProgramacionCommand>
    {
        public CreateEventoProgramacionCommandValidator()
        {
            RuleFor(x => x.DiaId).NotEmpty().WithMessage("El Id del día es obligatorio.");
            RuleFor(x => x.Nombre).NotEmpty().WithMessage("El nombre es obligatorio.")
                .MaximumLength(200).WithMessage("El nombre no puede exceder los 200 caracteres.")
                .IsPlainText();
            RuleFor(x => x.Descripcion).NotEmpty().WithMessage("La descripción es obligatoria.")
                .MaximumLength(100000).WithMessage("La descripción no puede exceder los 100000 caracteres.")
                .IsSafeHtml();
            RuleFor(x => x.FechaInicio).NotEmpty().WithMessage("La fecha de inicio es obligatoria.");
        }
    }
}
