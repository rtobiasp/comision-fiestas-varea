using Application.Common.Interfaces;

namespace Application.Features.Categorias.Commands.UpdateCategoria
{
    public class UpdateCategoriaCommandHandler
    {
        private readonly ICategoriaRepository _categoriaRepository;

        public UpdateCategoriaCommandHandler(ICategoriaRepository categoriaRepository)
        {
            _categoriaRepository = categoriaRepository;
        }

        public async Task Handle(
            UpdateCategoriaCommand request,
            CancellationToken cancellationToken)
        {
            var existingCategoria = await _categoriaRepository.GetAsync(request.Id, cancellationToken);

            existingCategoria.Nombre = request.Nombre;
            existingCategoria.Descripcion = request.Descripcion;

            await _categoriaRepository.UpdateAsync(existingCategoria, cancellationToken);
        }
    }
}
