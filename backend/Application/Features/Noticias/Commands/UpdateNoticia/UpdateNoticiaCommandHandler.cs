using Application.Common.Interfaces;

namespace Application.Features.Noticias.Commands.UpdateNoticia
{
    public class UpdateNoticiaCommandHandler
    {
        private readonly INoticiaRepository _noticiaRepository;
        private readonly ICategoriaRepository _categoriaRepository;

        public UpdateNoticiaCommandHandler(
            INoticiaRepository noticiaRepository,
            ICategoriaRepository categoriaRepository)
        {
            _noticiaRepository = noticiaRepository;
            _categoriaRepository = categoriaRepository;
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

            var existingNoticia = await _noticiaRepository.GetTrackedAsync(request.Id, cancellationToken);

            existingNoticia.Titulo = request.Titulo;
            existingNoticia.Subtitulo = request.Subtitulo;
            existingNoticia.Contenido = request.Contenido;
            existingNoticia.Publicada = request.Publicada;
            existingNoticia.Fijada = request.Fijada;

            // Sincroniza la relación N:N sobre la colección tracked: EF Core
            // inserta/borra solo las filas del puente (las categorías viajan
            // tracked desde el mismo DbContext, nunca como Added).
            var desiredIds = categorias.Select(c => c.Id).ToHashSet();
            foreach (var actual in existingNoticia.Categorias
                .Where(c => !desiredIds.Contains(c.Id)).ToList())
            {
                existingNoticia.Categorias.Remove(actual);
            }

            var actualIds = existingNoticia.Categorias.Select(c => c.Id).ToHashSet();
            foreach (var categoria in categorias.Where(c => !actualIds.Contains(c.Id)))
            {
                existingNoticia.Categorias.Add(categoria);
            }

            await _noticiaRepository.UpdateAsync(existingNoticia, cancellationToken);
        }
    }
}
