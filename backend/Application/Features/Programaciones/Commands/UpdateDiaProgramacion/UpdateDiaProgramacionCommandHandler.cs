using Application.Common.Interfaces;

namespace Application.Features.Programaciones.Commands.UpdateDiaProgramacion
{
    public class UpdateDiaProgramacionCommandHandler
    {
        private readonly IDiaProgramacionRepository _diaRepository;

        public UpdateDiaProgramacionCommandHandler(IDiaProgramacionRepository diaRepository)
        {
            _diaRepository = diaRepository;
        }

        public async Task Handle(
            UpdateDiaProgramacionCommand request,
            CancellationToken cancellationToken)
        {
            var existingDia = await _diaRepository.GetTrackedAsync(request.Id, cancellationToken);

            existingDia.Fecha = request.Fecha.Kind == DateTimeKind.Unspecified
                ? DateTime.SpecifyKind(request.Fecha, DateTimeKind.Utc)
                : request.Fecha.ToUniversalTime();

            await _diaRepository.UpdateAsync(existingDia, cancellationToken);
        }
    }
}
