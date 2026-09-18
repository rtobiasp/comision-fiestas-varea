using Application.Common.Interfaces;

namespace Application.Features.Noticias.Commands.DeleteNoticia
{
    public class DeleteNoticiaCommandHandler
    {
        private readonly INoticiaRepository _noticiaRepository;

        public DeleteNoticiaCommandHandler(INoticiaRepository noticiaRepository)
        {
            _noticiaRepository = noticiaRepository;
        }

        public async Task Handle(
            DeleteNoticiaCommand request,
            CancellationToken cancellationToken)
        {
            await _noticiaRepository.DeleteAsync(request.Id, cancellationToken);
        }

    }
}
