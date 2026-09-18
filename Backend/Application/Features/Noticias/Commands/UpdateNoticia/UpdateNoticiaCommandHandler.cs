using Application.Common.Interfaces;

namespace Application.Features.Noticias.Commands.UpdateNoticia
{
    public class UpdateNoticiaCommandHandler
    {
        private readonly INoticiaRepository _noticiaRepository;

        public UpdateNoticiaCommandHandler(INoticiaRepository noticiaRepository)
        {
            _noticiaRepository = noticiaRepository;
        }

        public async Task Handle(
            UpdateNoticiaCommand request,
            CancellationToken cancellationToken)
        {
            if (request.Id == Guid.Empty)
                throw new ArgumentException("El ID de la noticia es requerido.", nameof(request.Id));
            if (string.IsNullOrWhiteSpace(request.Titulo))
                throw new ArgumentException("El título es requerido.", nameof(request.Titulo));
            if (string.IsNullOrWhiteSpace(request.Contenido))
                throw new ArgumentException("El contenido es requerido.", nameof(request.Contenido));

            var existingNoticia = await _noticiaRepository.GetAsync(request.Id, cancellationToken);

            existingNoticia.Titulo = request.Titulo;
            existingNoticia.Subtitulo = request.Subtitulo;
            existingNoticia.Contenido = request.Contenido;
            existingNoticia.Publicada = request.Publicada;
            existingNoticia.Fijada = request.Fijada;

            await _noticiaRepository.UpdateAsync(existingNoticia, cancellationToken);
        }
    }
}
