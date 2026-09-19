using Application.Common.Interfaces;
using Domain.Entities;

namespace Application.Features.Categorias.Queries.GetAllCategorias
{
    public class GetAllCategoriasQueryHandler
    {
        private readonly ICategoriaRepository _categoriaRepository;

        public GetAllCategoriasQueryHandler(ICategoriaRepository categoriaRepository)
        {
            _categoriaRepository = categoriaRepository;
        }

        public async Task<List<Categoria>> Handle(
            GetAllCategoriasQuery request,
            CancellationToken cancellationToken)
        {
            var categorias = await _categoriaRepository.GetAllAsync(cancellationToken);
            return categorias;
        }
    }
}
