using Application.Common.Interfaces;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Services
{
    public sealed class LocalFileStorageService : IStorageService
    {
        private readonly string _rootPath;
        
        public LocalFileStorageService(IConfiguration configuration)
        {
            var configured = configuration.GetValue<string>("Storage:RootPath");

            if (string.IsNullOrWhiteSpace(configured))
                configured = Path.Combine("wwwroot", "uploads");

            _rootPath = Path.GetFullPath(
                Path.IsPathRooted(configured)
                    ? configured
                    : Path.Combine(AppContext.BaseDirectory, configured));

            Directory.CreateDirectory(_rootPath);
        }

        public async Task<(string storageKey, string urlRelativa, long bytes)> SaveAsync(Stream stream, string nombreOriginal, string contentType, string extension, CancellationToken cancellationToken)
        {
            ArgumentNullException.ThrowIfNull(stream);

            var ext = string.IsNullOrWhiteSpace(extension)
                ? Path.GetExtension(nombreOriginal)
                : extension.Trim();

            if (!ext.StartsWith('.'))
                ext = "." + ext;

            ext = ext.ToLowerInvariant();

            var fileName = $"{Guid.NewGuid():N}{ext}";
            var storageKey = fileName;

            var fullPath = Path.GetFullPath(Path.Combine(_rootPath, fileName));

            if (!fullPath.StartsWith(_rootPath + Path.DirectorySeparatorChar, StringComparison.Ordinal))
                throw new InvalidOperationException("La ruta de destino queda fuera del almacenamiento configurado.");

            Directory.CreateDirectory(_rootPath);

            if (stream.CanSeek && stream.Position > 0)
                stream.Seek(0, SeekOrigin.Begin);

            await using (var file = new FileStream(fullPath, FileMode.CreateNew, FileAccess.Write, FileShare.None, 81920, useAsync: true))
            {
                await stream.CopyToAsync(file, cancellationToken);
            }

            var bytes = new FileInfo(fullPath).Length;
            var urlRelativa = $"/uploads/{fileName}";

            return (storageKey, urlRelativa, bytes);
        }

        public Task DeleteAsync(string storageKey, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(storageKey))
                throw new ArgumentException("StorageKey vacío.", nameof(storageKey));

            var fileName = Path.GetFileName(storageKey);
            var fullPath = Path.GetFullPath(Path.Combine(_rootPath, fileName));

            if (!fullPath.StartsWith(_rootPath + Path.DirectorySeparatorChar, StringComparison.Ordinal))
                throw new InvalidOperationException("La ruta a borrar queda fuera del almacenamiento configurado.");

            if (File.Exists(fullPath))
                File.Delete(fullPath);

            return Task.CompletedTask;
        }
    }
}
