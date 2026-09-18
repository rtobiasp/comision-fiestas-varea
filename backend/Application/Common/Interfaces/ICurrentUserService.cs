using System;

namespace Application.Common.Interfaces
{
    /// <summary>
    /// Abstracción del usuario actual. Hasta la fase 03 (OIDC/JWT) devuelve "system".
    /// </summary>
    public interface ICurrentUserService
    {
        string GetUserName();
    }
}
