using Application.Common.Interfaces;
using Application.Features.Notificaciones.Dtos;

namespace Application.Features.Notificaciones.Queries.GetNotificacionById
{
    public class GetNotificacionByIdQueryHandler
    {
        private readonly INotificacionRepository _notificacionRepository;

        public GetNotificacionByIdQueryHandler(INotificacionRepository notificacionRepository)
        {
            _notificacionRepository = notificacionRepository;
        }

        public async Task<NotificacionDto> Handle(
            GetNotificacionByIdQuery request,
            CancellationToken cancellationToken)
        {
            var notificacion = await _notificacionRepository.GetAsync(request.Id, cancellationToken);
            return NotificacionMapper.ToDto(notificacion);
        }
    }
}
