using Application.Common.Validation;
using FluentValidation;

namespace Application.Features.Eventos.Commands.UpdateEvento
{
    public class UpdateEventoCommandValidator : AbstractValidator<UpdateEventoCommand>
    {
        public UpdateEventoCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("El Id del evento es obligatorio.");

            RuleFor(x => x.Titulo)
                .NotEmpty().WithMessage("El título es obligatorio.")
                .MaximumLength(200).WithMessage("El título no puede exceder los 200 caracteres.")
                .IsPlainText();

            RuleFor(x => x.Descripcion)
                .NotEmpty().WithMessage("La descripción es obligatoria.")
                .MaximumLength(100000).WithMessage("La descripción no puede exceder los 100000 caracteres.")
                .IsSafeHtml();

            RuleFor(x => x.Lugar)
                .NotEmpty().WithMessage("El lugar es obligatorio.")
                .MaximumLength(200).WithMessage("El lugar no puede exceder los 200 caracteres.")
                .IsPlainText();

            RuleFor(x => x.FechaInicio)
                .NotEmpty().WithMessage("La fecha de inicio es obligatoria.");

            RuleFor(x => x.FechaFin)
                .GreaterThanOrEqualTo(x => x.FechaInicio)
                .WithMessage("La fecha de fin no puede ser anterior a la fecha de inicio.")
                .When(x => x.FechaFin.HasValue);

            RuleFor(x => x.ImagenPortada)
                .IsValidPortadaUrl();

            RuleFor(x => x.Aforo)
                .GreaterThan(0).WithMessage("El aforo debe ser mayor que cero.")
                .When(x => x.Aforo.HasValue);

            RuleFor(x => x.CategoriaIds)
                .IsValidCategoriaIds();

            RuleFor(x => x.TagIds)
                .IsValidTagIds();
        }
    }
}
