using Application.Common.Interfaces;

namespace Application.Features.Noticias.Commands.DeleteNoticia
{
    // Handler Wolverine: sin interfaces, dependencia por constructor
    // (ver CreateNoticiaCommandHandler).
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
            if (request.Id == Guid.Empty)
                throw new ArgumentException("El ID de la noticia es requerido.", nameof(request.Id));

            await _noticiaRepository.DeleteAsync(request.Id, cancellationToken);
        }

    }
}
