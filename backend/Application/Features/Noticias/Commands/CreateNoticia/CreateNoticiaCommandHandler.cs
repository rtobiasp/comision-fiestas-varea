using Application.Common.Interfaces;
using Application.Features.Noticias.Dtos;
using Domain.Entities;

namespace Application.Features.Noticias.Commands.CreateNoticia
{
    public class CreateNoticiaCommandHandler
    {
        private readonly INoticiaRepository _noticiaRepository;
        private readonly ICategoriaRepository _categoriaRepository;

        public CreateNoticiaCommandHandler(
            INoticiaRepository noticiaRepository,
            ICategoriaRepository categoriaRepository)
        {
            _noticiaRepository = noticiaRepository;
            _categoriaRepository = categoriaRepository;
        }

        public async Task<NoticiaDto> Handle(
            CreateNoticiaCommand request,
            CancellationToken cancellationToken)
        {
            var categoriaIds = (request.CategoriaIds ?? new List<Guid>()).Distinct().ToList();
            var categorias = await _categoriaRepository.GetByIdsAsync(categoriaIds, cancellationToken);

            if (categorias.Count != categoriaIds.Count)
            {
                throw new KeyNotFoundException("Alguna de las categorías indicadas no existe.");
            }

            var noticia = new Noticia
            {
                Titulo = request.Titulo,
                Subtitulo = request.Subtitulo,
                Contenido = request.Contenido,
                Fijada = request.Fijada,
                Categorias = categorias,
            };

            var newNoticia = await _noticiaRepository.AddAsync(noticia, cancellationToken);
            return NoticiaMapper.ToDto(newNoticia);
        }
    }
}
