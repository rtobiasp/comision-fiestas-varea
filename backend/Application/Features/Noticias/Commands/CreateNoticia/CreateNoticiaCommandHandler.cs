using Application.Common.Interfaces;
using Domain.Entities;

namespace Application.Features.Noticias.Commands.CreateNoticia
{
    public class CreateNoticiaCommandHandler
    {
        private readonly INoticiaRepository _noticiaRepository;

        public CreateNoticiaCommandHandler(INoticiaRepository noticiaRepository)
        {
            _noticiaRepository = noticiaRepository;
        }

        public async Task<Noticia> Handle(
            CreateNoticiaCommand request,
            CancellationToken cancellationToken)
        {
            var noticia = new Noticia
            {
                Titulo = request.Titulo,
                Subtitulo = request.Subtitulo,
                Contenido = request.Contenido,
                Fijada = request.Fijada,
            };

            var newNoticia = await _noticiaRepository.AddAsync(noticia, cancellationToken);
            return newNoticia;
        }
    }
}
