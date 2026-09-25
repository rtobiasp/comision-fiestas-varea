using Application.Common.Interfaces;
using Application.Features.Categorias.Dtos;

namespace Application.Features.Categorias.Queries.GetCategoriaById
{
    public class GetCategoriaByIdQueryHandler
    {
        private readonly ICategoriaRepository _categoriaRepository;

        public GetCategoriaByIdQueryHandler(ICategoriaRepository categoriaRepository)
        {
            _categoriaRepository = categoriaRepository;
        }

        public async Task<CategoriaDto> Handle(
            GetCategoriaByIdQuery request,
            CancellationToken cancellationToken)
        {
            var categoria = await _categoriaRepository.GetAsync(request.Id, cancellationToken);
            return new CategoriaDto(
                categoria.Id,
                categoria.Nombre,
                categoria.Descripcion,
                categoria.CategoriaPadreId,
                categoria.CreatedAt,
                categoria.CreatedBy
            );
        }
    }
}
