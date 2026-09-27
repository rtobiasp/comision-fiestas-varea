# AGENTS.md — comision-fiestas-varea

## Fuente de verdad funcional y tecnológica
- Ante cualquier duda sobre cómo debe funcionar algo o qué tecnologías usar, leer `Plan_Implementacion_App_Fiestas.pdf` antes de decidir. Manda sobre suposiciones.
- Define el roadmap en estricto orden de dependencia: 01 dominio/persistencia → 02 CQRS (Wolverine MediatorOnly + FluentValidation) → 03 OIDC/RBAC (Auth0/Clerk, JWT) → 04 API REST/OpenAPI → 05 frontend público Next.js 15 + ISR/SEO → 06 intranet gestión → 07 Redis/HybridCache → 08 tests (xUnit, Testcontainers, Playwright) → 09 observabilidad (Serilog, HealthChecks, RateLimiting) → 10 analítica RGPD + CI/CD. No adelantar fases que dependen de otras sin modelar.

## Layout
- `backend/` — .NET 10 solution `Backend.slnx` (new XML solution format). 4 projects: `API` / `Application` / `Domain` / `Infrastructure`.
  - `Domain/Entities/` — entities only (currently just `Noticia`).
  - `Application/Interfaces/` — repository/use-case interfaces only, no logic yet.
  - `Infrastructure/` — EF Core `PostgreContext`, `Repositories/`, `Configurations/`, `Migrations/`.
  - `API/` — entrypoint `Program.cs` + `Controllers/` (currently only `NoticiasController` → `api/Noticias`).
- `frontend/` — Next.js + Tailwind v4 + shadcn (ver `frontend/components.json` y `frontend/components/ui/`). `.gitignore` anticipa Vite/React/Node.
- `docker/` — `docker-compose.yml` (postgres + optional pgAdmin), `postgres/init.sql`, `.env.example` (reference only).

## Frontend UI/UX — shadcn obligatorio
- Al crear cualquier componente de UI/UX en `frontend/`, usar obligatoriamente shadcn: reutilizar primero lo existente en `frontend/components/ui/` (ej. `table.tsx` → `Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead`, `TableCell`, `TableCaption`).
- Si el componente shadcn no existe aún, añadirlo con `npx shadcn@latest add <componente>` desde `frontend/` (respeta `frontend/components.json`: style `base-nova`, RSC, Tailwind v4 en `app/globals.css`, `baseColor: neutral`, `cssVariables: true`, iconos `lucide`, alias `@/components/ui`). No reimplementarlo a mano ni inventar otro sistema de diseño.
- Componer sobre shadcn + `cn` + `class-variance-authority` + tokens CSS de `app/globals.css`; mantener `data-slot`, variantes y estilos base, extendiendo solo vía `className`. No introducir otra librería UI ni estilos globales fuera de `app/globals.css`.

## Commands (run from repo root unless noted)
- Build: `dotnet build backend/Backend.slnx`
- Run API (from `backend/`): `dotnet run --project API` — Swagger at `http://localhost:5243/swagger` (Development only; see `API/Properties/launchSettings.json`).
- DB up (from `docker/`): `docker compose up -d`; tools profile: `docker compose --profile tools up -d` (pgAdmin on `:5050`).
- EF migrations (from `backend/`, needs `dotnet-ef` tool): `dotnet ef migrations add <Name> --project Infrastructure --startup-project API` then `dotnet ef database update --project Infrastructure --startup-project API`.
- No tests, lint, CI, or task runner exist yet — don't invent them.

## Secrets / config — strict, do NOT break
- Backend NEVER reads `.env`. Connection string resolves via .NET config: `ConnectionStrings:DefaultConnection` (`appsettings.json` ships it empty).
  - Local dev: `dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;..."` (API has `UserSecretsId`; run from `backend/API/`).
  - Prod/container: env var `ConnectionStrings__DefaultConnection` from the platform secret manager.
- `docker/.env.example` is documentation only; `docker-compose.yml` has NO `env_file` and reads overrides from shell env (`$env:VAR="..."` in PowerShell) with `POSTGRES_*` defaults. Never create a real `.env` file with secrets.

## DB / EF gotchas
- `docker/postgres/init.sql` only enables `pgcrypto` (`gen_random_uuid()`) and runs ONLY on first volume creation — schema changes go through EF migrations, not this file. `Noticias` table lives in `contenido` schema (`NoticiaConfiguration`).
- `NoticiaConfiguration`: `Id` uuid default `gen_random_uuid()`, `FechaPublicacion` timestamptz default `now()`. Repository also assigns `Guid`/`UtcNow` client-side and coerces `DateTimeKind.Utc` — keep UTC, don't store local times.
- Naming anomaly is real: `Noticia.esBorrador` / `publicada` are camelCase — match existing style, don't silently rename (it's mapped to DB columns).

## Known gaps (don't assume they're done)
- `NoticiaRepository.DeleteAsync` throws `NotImplementedException`; no update path, no tests, no auth/validation beyond `[ApiController]`.
