using Application.Common.Interfaces;

namespace Application.Features.Programaciones.Commands.DeleteDiaProgramacion
{
    public class DeleteDiaProgramacionCommandHandler
    {
        private readonly IDiaProgramacionRepository _diaRepository;

        public DeleteDiaProgramacionCommandHandler(IDiaProgramacionRepository diaRepository)
        {
            _diaRepository = diaRepository;
        }

        public async Task Handle(
            DeleteDiaProgramacionCommand request,
            CancellationToken cancellationToken)
        {
            await _diaRepository.DeleteAsync(request.Id, cancellationToken);
        }
    }
}
