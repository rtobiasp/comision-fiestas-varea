using Application.Common.Interfaces;
using Application.Features.Programaciones.Dtos;

namespace Application.Features.Programaciones.Queries.GetEventoProgramacionById
{
    public class GetEventoProgramacionByIdQueryHandler
    {
        private readonly IEventoProgramacionRepository _eventoRepository;

        public GetEventoProgramacionByIdQueryHandler(IEventoProgramacionRepository eventoRepository)
        {
            _eventoRepository = eventoRepository;
        }

        public async Task<EventoProgramacionDto> Handle(
            GetEventoProgramacionByIdQuery request,
            CancellationToken cancellationToken)
        {
            var evento = await _eventoRepository.GetAsync(request.Id, cancellationToken);
            return EventoProgramacionMapper.ToDto(evento);
        }
    }
}
