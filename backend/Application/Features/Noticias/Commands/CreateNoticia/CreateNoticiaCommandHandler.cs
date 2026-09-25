using Application.Common.Interfaces;
using Application.Features.Noticias.Dtos;
using Domain.Entities;

namespace Application.Features.Noticias.Commands.CreateNoticia
{
    public class CreateNoticiaCommandHandler
    {
        private readonly INoticiaRepository _noticiaRepository;
        private readonly ICategoriaRepository _categoriaRepository;
        private readonly ITagRepository _tagRepository;

        public CreateNoticiaCommandHandler(
            INoticiaRepository noticiaRepository,
            ICategoriaRepository categoriaRepository,
            ITagRepository tagRepository)
        {
            _noticiaRepository = noticiaRepository;
            _categoriaRepository = categoriaRepository;
            _tagRepository = tagRepository;
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

            var tagIds = (request.TagIds ?? new List<Guid>()).Distinct().ToList();
            var tags = await _tagRepository.GetByIdsAsync(tagIds, cancellationToken);

            if (tags.Count != tagIds.Count)
            {
                throw new KeyNotFoundException("Alguno de los tags indicados no existe.");
            }

            var noticia = new Noticia
            {
                Titulo = request.Titulo,
                Subtitulo = request.Subtitulo,
                Contenido = request.Contenido,
                Fijada = request.Fijada,
                Categorias = categorias,
                Tags = tags,
            };

            var newNoticia = await _noticiaRepository.AddAsync(noticia, cancellationToken);
            return NoticiaMapper.ToDto(newNoticia);
        }
    }
}
