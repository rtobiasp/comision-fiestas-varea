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

            if (request.CategoriaPadreId.HasValue)
            {
                if (request.CategoriaPadreId.Value == request.Id)
                    throw new FluentValidation.ValidationException("Una categoría no puede ser su propia padre.");

                // Valida que la categoría padre exista (404 si no) antes de mover la hija.
                await _categoriaRepository.GetAsync(request.CategoriaPadreId.Value, cancellationToken);
            }

            existingCategoria.Nombre = request.Nombre;
            existingCategoria.Descripcion = request.Descripcion;
            existingCategoria.CategoriaPadreId = request.CategoriaPadreId;

            await _categoriaRepository.UpdateAsync(existingCategoria, cancellationToken);
        }
    }
}
