using Application.Common.Interfaces;

namespace Application.Features.Programaciones.Commands.UpdateProgramacion
{
    public class UpdateProgramacionCommandHandler
    {
        private readonly IProgramacionRepository _programacionRepository;

        public UpdateProgramacionCommandHandler(IProgramacionRepository programacionRepository)
        {
            _programacionRepository = programacionRepository;
        }

        public async Task Handle(
            UpdateProgramacionCommand request,
            CancellationToken cancellationToken)
        {
            var existingProgramacion = await _programacionRepository.GetTrackedAsync(request.Id, cancellationToken);

            existingProgramacion.Nombre = request.Nombre;

            await _programacionRepository.UpdateAsync(existingProgramacion, cancellationToken);
        }
    }
}
