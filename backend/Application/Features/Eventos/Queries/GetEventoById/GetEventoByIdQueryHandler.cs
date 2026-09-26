using Application.Common.Interfaces;
using Application.Features.Eventos.Dtos;

namespace Application.Features.Eventos.Queries.GetEventoById
{
    public class GetEventoByIdQueryHandler
    {
        private readonly IEventoRepository _eventoRepository;

        public GetEventoByIdQueryHandler(IEventoRepository eventoRepository)
        {
            _eventoRepository = eventoRepository;
        }

        public async Task<EventoDto> Handle(
            GetEventoByIdQuery request,
            CancellationToken cancellationToken)
        {
            var evento = await _eventoRepository.GetAsync(request.Id, cancellationToken);
            return EventoMapper.ToDto(evento);
        }
    }
}
