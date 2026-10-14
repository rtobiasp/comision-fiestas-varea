using Application.Common.Interfaces;
using Application.Features.Programaciones.Dtos;

namespace Application.Features.Programaciones.Queries.GetEventosByDia
{
    public class GetEventosByDiaQueryHandler
    {
        private readonly IEventoProgramacionRepository _eventoRepository;
        private readonly IDiaProgramacionRepository _diaRepository;

        public GetEventosByDiaQueryHandler(
            IEventoProgramacionRepository eventoRepository,
            IDiaProgramacionRepository diaRepository)
        {
            _eventoRepository = eventoRepository;
            _diaRepository = diaRepository;
        }

        public async Task<List<EventoProgramacionDto>> Handle(
            GetEventosByDiaQuery request,
            CancellationToken cancellationToken)
        {
            if (!await _diaRepository.ExistsAsync(request.DiaId, cancellationToken))
            {
                throw new KeyNotFoundException("No se han encontrado días con los parámetros proporcionados");
            }

            var descending = !string.Equals(request.Direction, "asc", StringComparison.OrdinalIgnoreCase);

            var eventos = await _eventoRepository.GetByDiaAsync(
                request.DiaId, request.Offset, request.Limit, descending, cancellationToken);

            return eventos.Select(EventoProgramacionMapper.ToDto).ToList();
        }
    }
}
