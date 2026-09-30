using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Common.Interfaces
{
    public interface IStorageService
    {
        Task<(string storageKey, string urlRelativa, long bytes)> SaveAsync(Stream stream, string nombreOriginal, string contentType, string extension, CancellationToken cancellationToken);
        Task DeleteAsync(string storageKey, CancellationToken cancellationToken);
    }
}
