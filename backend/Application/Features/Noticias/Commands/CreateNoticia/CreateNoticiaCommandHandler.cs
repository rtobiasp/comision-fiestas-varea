using Application.Common.Interfaces;
using Application.Features.Noticias.Dtos;
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

        public async Task<NoticiaDto> Handle(
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
            return new NoticiaDto(
                newNoticia.Id,
                newNoticia.Titulo,
                newNoticia.Subtitulo,
                newNoticia.Contenido,
                newNoticia.Publicada,
                newNoticia.Fijada,
                newNoticia.CreatedAt,
                newNoticia.CreatedBy
            );
        }
    }
}
