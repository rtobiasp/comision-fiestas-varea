using Application.Common.Interfaces;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace Infrastructure.Persistence.Interceptors
{
    /// <summary>
    /// Rellena la auditoría automáticamente y convierte borrados físicos
    /// en soft-delete para las entidades que implementan <see cref="ISoftDeletable"/>
    /// (p. ej. futuros cobros: nunca se borran físicamente).
    /// Siempre en UTC, nunca hora local.
    /// </summary>
    public sealed class AuditableEntityInterceptor : SaveChangesInterceptor
    {
        private readonly ICurrentUserService _currentUser;

        public AuditableEntityInterceptor(ICurrentUserService currentUser)
        {
            _currentUser = currentUser;
        }

        public override InterceptionResult<int> SavingChanges(
            DbContextEventData eventData,
            InterceptionResult<int> result)
        {
            Apply(eventData.Context);
            return base.SavingChanges(eventData, result);
        }

        public override ValueTask<InterceptionResult<int>> SavingChangesAsync(
            DbContextEventData eventData,
            InterceptionResult<int> result,
            CancellationToken cancellationToken = default)
        {
            Apply(eventData.Context);
            return base.SavingChangesAsync(eventData, result, cancellationToken);
        }

        private void Apply(DbContext? context)
        {
            if (context is null)
                return;

            var now = DateTime.UtcNow;
            var user = _currentUser.GetUserName();

            foreach (var entry in context.ChangeTracker.Entries<IAuditableEntity>())
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        if (entry.Entity.CreatedAt == default)
                            entry.Entity.CreatedAt = now;
                        else
                            entry.Entity.CreatedAt = EnsureUtc(entry.Entity.CreatedAt);

                        if (string.IsNullOrWhiteSpace(entry.Entity.CreatedBy))
                            entry.Entity.CreatedBy = user;
                        break;

                    case EntityState.Modified:
                        entry.Entity.LastModifiedAt = now;
                        entry.Entity.LastModifiedBy = user;
                        // La auditoría de creación es inmutable: SetValues del repositorio no debe pisarla.
                        entry.Property(e => e.CreatedAt).IsModified = false;
                        entry.Property(e => e.CreatedBy).IsModified = false;
                        break;
                }
            }

            foreach (var entry in context.ChangeTracker.Entries<ISoftDeletable>())
            {
                if (entry.State != EntityState.Deleted)
                    continue;

                entry.State = EntityState.Modified;
                entry.Entity.IsDeleted = true;
                entry.Entity.DeletedAt = now;

                if (entry.Entity is IAuditableEntity auditable)
                {
                    auditable.LastModifiedAt = now;
                    auditable.LastModifiedBy = user;
                }
            }
        }

        private static DateTime EnsureUtc(DateTime value) =>
            value.Kind == DateTimeKind.Utc ? value : DateTime.SpecifyKind(value, DateTimeKind.Utc);
    }
}
