using Application.Common.Interfaces;

namespace Application.Features.Eventos.Commands.DeleteEvento
{
    public class DeleteEventoCommandHandler
    {
        private readonly IEventoRepository _eventoRepository;

        public DeleteEventoCommandHandler(IEventoRepository eventoRepository)
        {
            _eventoRepository = eventoRepository;
        }

        public async Task Handle(
            DeleteEventoCommand request,
            CancellationToken cancellationToken)
        {
            await _eventoRepository.DeleteAsync(request.Id, cancellationToken);
        }
    }
}
