using Application.Common.Interfaces;

namespace Application.Features.Categorias.Commands.DeleteCategoria
{
    public class DeleteCategoriaCommandHandler
    {
        private readonly ICategoriaRepository _categoriaRepository;

        public DeleteCategoriaCommandHandler(ICategoriaRepository categoriaRepository)
        {
            _categoriaRepository = categoriaRepository;
        }

        public async Task Handle(
            DeleteCategoriaCommand request,
            CancellationToken cancellationToken)
        {
            if (await _categoriaRepository.HasNoticiasAsync(request.Id, cancellationToken))
            {
                throw new InvalidOperationException("No se puede eliminar la categoría porque tiene noticias asociadas.");
            }

            await _categoriaRepository.DeleteAsync(request.Id, cancellationToken);
        }
    }
}
