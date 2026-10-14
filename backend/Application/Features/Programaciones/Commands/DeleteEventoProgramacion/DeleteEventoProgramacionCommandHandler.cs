using Application.Common.Interfaces;

namespace Application.Features.Programaciones.Commands.DeleteEventoProgramacion
{
    public class DeleteEventoProgramacionCommandHandler
    {
        private readonly IEventoProgramacionRepository _eventoRepository;

        public DeleteEventoProgramacionCommandHandler(IEventoProgramacionRepository eventoRepository)
        {
            _eventoRepository = eventoRepository;
        }

        public async Task Handle(
            DeleteEventoProgramacionCommand request,
            CancellationToken cancellationToken)
        {
            await _eventoRepository.DeleteAsync(request.Id, cancellationToken);
        }
    }
}
