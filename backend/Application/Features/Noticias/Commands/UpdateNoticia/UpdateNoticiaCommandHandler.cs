using Application.Common.Interfaces;
using Domain.Entities;

namespace Application.Features.Noticias.Commands.UpdateNoticia
{
    public class UpdateNoticiaCommandHandler
    {
        private readonly INoticiaRepository _noticiaRepository;
        private readonly ICategoriaRepository _categoriaRepository;
        private readonly ITagRepository _tagRepository;

        public UpdateNoticiaCommandHandler(
            INoticiaRepository noticiaRepository,
            ICategoriaRepository categoriaRepository,
            ITagRepository tagRepository)
        {
            _noticiaRepository = noticiaRepository;
            _categoriaRepository = categoriaRepository;
            _tagRepository = tagRepository;
        }

        public async Task Handle(
            UpdateNoticiaCommand request,
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

            var existingNoticia = await _noticiaRepository.GetTrackedAsync(request.Id, cancellationToken);

            existingNoticia.Titulo = request.Titulo;
            existingNoticia.Subtitulo = request.Subtitulo;
            existingNoticia.Contenido = request.Contenido;
            existingNoticia.Publicada = request.Publicada;
            existingNoticia.Fijada = request.Fijada;

            SyncCategorias(existingNoticia, categorias);
            SyncTags(existingNoticia, tags);

            await _noticiaRepository.UpdateAsync(existingNoticia, cancellationToken);
        }

        private static void SyncCategorias(Noticia noticia, List<Categoria> categorias)
        {
            var desiredIds = categorias.Select(c => c.Id).ToHashSet();
            foreach (var actual in noticia.Categorias
                .Where(c => !desiredIds.Contains(c.Id)).ToList())
            {
                noticia.Categorias.Remove(actual);
            }

            var actualIds = noticia.Categorias.Select(c => c.Id).ToHashSet();
            foreach (var categoria in categorias.Where(c => !actualIds.Contains(c.Id)))
            {
                noticia.Categorias.Add(categoria);
            }
        }

        private static void SyncTags(Noticia noticia, List<Tag> tags)
        {
            var desiredIds = tags.Select(t => t.Id).ToHashSet();
            foreach (var actual in noticia.Tags
                .Where(t => !desiredIds.Contains(t.Id)).ToList())
            {
                noticia.Tags.Remove(actual);
            }

            var actualIds = noticia.Tags.Select(t => t.Id).ToHashSet();
            foreach (var tag in tags.Where(t => !actualIds.Contains(t.Id)))
            {
                noticia.Tags.Add(tag);
            }
        }
    }
}
