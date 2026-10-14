using Application.Common.Interfaces;
using Application.Features.Programaciones.Dtos;

namespace Application.Features.Programaciones.Commands.CreateEventoProgramacion
{
    public class CreateEventoProgramacionCommandHandler
    {
        private readonly IEventoProgramacionRepository _eventoRepository;
        private readonly IDiaProgramacionRepository _diaRepository;

        public CreateEventoProgramacionCommandHandler(
            IEventoProgramacionRepository eventoRepository,
            IDiaProgramacionRepository diaRepository)
        {
            _eventoRepository = eventoRepository;
            _diaRepository = diaRepository;
        }

        public async Task<EventoProgramacionDto> Handle(
            CreateEventoProgramacionCommand request,
            CancellationToken cancellationToken)
        {
            if (!await _diaRepository.ExistsAsync(request.DiaId, cancellationToken))
            {
                throw new KeyNotFoundException("No se han encontrado días con los parámetros proporcionados");
            }

            var evento = new Domain.Entities.EventoProgramacion
            {
                Nombre = request.Nombre,
                Descripcion = request.Descripcion,
                FechaInicio = request.FechaInicio.Kind == DateTimeKind.Unspecified
                    ? DateTime.SpecifyKind(request.FechaInicio, DateTimeKind.Utc)
                    : request.FechaInicio.ToUniversalTime(),
            };

            var newEvento = await _eventoRepository.AddAsync(request.DiaId, evento, cancellationToken);
            return EventoProgramacionMapper.ToDto(newEvento);
        }
    }
}
