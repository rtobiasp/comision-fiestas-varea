using Application.Common.Interfaces;

namespace Application.Features.Notificaciones.Commands.DeleteNotificacion
{
    public class DeleteNotificacionCommandHandler
    {
        private readonly INotificacionRepository _notificacionRepository;

        public DeleteNotificacionCommandHandler(INotificacionRepository notificacionRepository)
        {
            _notificacionRepository = notificacionRepository;
        }

        public async Task Handle(
            DeleteNotificacionCommand request,
            CancellationToken cancellationToken)
        {
            await _notificacionRepository.DeleteAsync(request.Id, cancellationToken);
        }
    }
}
