using Application.Common.Interfaces;

namespace Application.Features.Programaciones.Commands.DeleteProgramacion
{
    public class DeleteProgramacionCommandHandler
    {
        private readonly IProgramacionRepository _programacionRepository;

        public DeleteProgramacionCommandHandler(IProgramacionRepository programacionRepository)
        {
            _programacionRepository = programacionRepository;
        }

        public async Task Handle(
            DeleteProgramacionCommand request,
            CancellationToken cancellationToken)
        {
            await _programacionRepository.DeleteAsync(request.Id, cancellationToken);
        }
    }
}
