using Application.Common.Interfaces;
using Application.Features.Categorias.Dtos;

namespace Application.Features.Categorias.Queries.GetAllCategorias
{
    public class GetAllCategoriasQueryHandler
    {
        private readonly ICategoriaRepository _categoriaRepository;

        public GetAllCategoriasQueryHandler(ICategoriaRepository categoriaRepository)
        {
            _categoriaRepository = categoriaRepository;
        }

        public async Task<List<CategoriaDto>> Handle(
            GetAllCategoriasQuery request,
            CancellationToken cancellationToken)
        {
            var categorias = await _categoriaRepository.GetAllAsync(cancellationToken);
            var counts = await _categoriaRepository.CountNoticiasByCategoriasAsync(cancellationToken);
            return categorias.Select(c => new CategoriaDto(
                c.Id,
                c.Nombre,
                c.Descripcion,
                c.CategoriaPadreId,
                c.CreatedAt,
                c.CreatedBy,
                counts.TryGetValue(c.Id, out var count) ? count : 0
            )).ToList();
        }
    }
}
