using Application.Interfaces;
using System.Security.Claims;

namespace API.Services
{
    /// <summary>
    /// Resuelve el nombre del usuario actual desde el HttpContext.
    /// Sin autenticación (fases 01-02, antes de OIDC) devuelve "system".
    /// Trunca a 100 caracteres para respetar el mapeo de CreatedBy/LastModifiedBy.
    /// Vive en API para no acoplar Infrastructure a ASP.NET Core.
    /// </summary>
    public sealed class CurrentUserService : ICurrentUserService
    {
        private const string Fallback = "system";
        private const int MaxLength = 100;

        private readonly IHttpContextAccessor _httpContextAccessor;

        public CurrentUserService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public string GetUserName()
        {
            var user = _httpContextAccessor.HttpContext?.User;
            if (user?.Identity?.IsAuthenticated != true)
                return Fallback;

            var name =
                user.FindFirstValue(ClaimTypes.NameIdentifier) ??
                user.FindFirstValue("preferred_username") ??
                user.FindFirstValue("sub") ??
                user.Identity?.Name;

            if (string.IsNullOrWhiteSpace(name))
                return Fallback;

            name = name.Trim();
            return name.Length > MaxLength ? name.Substring(0, MaxLength) : name;
        }
    }
}
