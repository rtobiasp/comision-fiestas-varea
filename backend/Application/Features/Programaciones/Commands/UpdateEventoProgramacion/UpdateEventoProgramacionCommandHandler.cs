using Application.Common.Interfaces;

namespace Application.Features.Programaciones.Commands.UpdateEventoProgramacion
{
    public class UpdateEventoProgramacionCommandHandler
    {
        private readonly IEventoProgramacionRepository _eventoRepository;

        public UpdateEventoProgramacionCommandHandler(IEventoProgramacionRepository eventoRepository)
        {
            _eventoRepository = eventoRepository;
        }

        public async Task Handle(
            UpdateEventoProgramacionCommand request,
            CancellationToken cancellationToken)
        {
            var existingEvento = await _eventoRepository.GetTrackedAsync(request.Id, cancellationToken);

            existingEvento.Nombre = request.Nombre;
            existingEvento.Descripcion = request.Descripcion;
            existingEvento.FechaInicio = request.FechaInicio.Kind == DateTimeKind.Unspecified
                ? DateTime.SpecifyKind(request.FechaInicio, DateTimeKind.Utc)
                : request.FechaInicio.ToUniversalTime();

            await _eventoRepository.UpdateAsync(existingEvento, cancellationToken);
        }
    }
}
