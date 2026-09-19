using Application.Common.Interfaces;
using Domain.Entities;

namespace Application.Features.Categorias.Queries.GetCategoriaById
{
    public class GetCategoriaByIdQueryHandler
    {
        private readonly ICategoriaRepository _categoriaRepository;

        public GetCategoriaByIdQueryHandler(ICategoriaRepository categoriaRepository)
        {
            _categoriaRepository = categoriaRepository;
        }

        public async Task<Categoria> Handle(
            GetCategoriaByIdQuery request,
            CancellationToken cancellationToken)
        {
            return await _categoriaRepository.GetAsync(request.Id, cancellationToken);
        }
    }
}
