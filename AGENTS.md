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
- `frontend/` — Next.js + Tailwind v4 (sin shadcn, ver regla Frontend UI/UX). `.gitignore` anticipa Vite/React/Node.
- `docker/` — `docker-compose.yml` (postgres + optional pgAdmin), `postgres/init.sql`, `.env.example` (reference only).

## Frontend UI/UX — shadcn prohibido
- En `frontend/`, prohibido escribir comentarios en el código (`//`, `/* */`, `{/* */}`, JSDoc): ni explicativos ni marcadores tipo `REAL`/`PRUEBA`/`TODO`. El código debe ser autoexplicativo.
- Excepciones: directivas funcionales `eslint-disable-*` (sin ellas falla el lint), ficheros generados (`types/api.d.ts`, `node_modules/`, `.next/`) y restos heredados (`components/ui/` de shadcn, salvo `components/ui/tiptap/`, que es código propio y tampoco lleva comentarios).
- En `frontend/`, prohibido usar shadcn: no importar nada de `frontend/components/ui/`, no basarse en `frontend/components.json`, no ejecutar `npx shadcn@latest add` y no apoyarse en `cn` ni en `class-variance-authority` como sistema de diseño.
- Los componentes de UI/UX en `frontend/` se escriben a mano con React + Tailwind v4 (tokens de `app/globals.css`) e iconos `lucide-react` directos. No introducir otra librería UI ni estilos globales fuera de `app/globals.css`.
- `frontend/components/ui/` y `frontend/components.json` son restos heredados: no usarlos como referencia ni como base; el código nuevo no debe depender de ellos.

## Frontend — paleta de marca Comisión Fiestas Varea
- Fuente única: bloque `:root` en `frontend/app/globals.css`. No duplicar estos valores en ningún otro fichero.
  - Sólidos (admiten texto blanco `#FFFFFF`): `--varea-primary: #14532D`, `--varea-primary-hover: #166534`, `--varea-secondary: #881337`, `--varea-accent-ocre: #92400E`, `--varea-accent-iregua: #075985`.
  - Superficies: `--varea-bg-main: #F7F6F2`, `--varea-bg-alt: #EFECE6`, `--varea-surface: #FFFFFF`, `--varea-border: #D6D3CD`.
  - Texto y foco: `--varea-text-main: #1C1917`, `--varea-text-muted: #44403C`, `--varea-text-on-dark: #FFFFFF`, `--varea-focus-ring: #15803D`.
  - Badges (fondo pastel + texto oscuro, parejas AAA): `--varea-badge-mercado-*` (`#DCFCE7` / `#14532D` / `#86EFAC`), `--varea-badge-gastro-*` (`#FEF3C7` / `#78350F` / `#FCD34D`), `--varea-badge-tradicion-*` (`#FFE4E6` / `#881337` / `#FDA4AF`), `--varea-badge-rio-*` (`#E0F2FE` / `#0C4A6E` / `#7DD3FC`).
- Usar solo las utilidades Tailwind generadas desde `@theme inline`: `bg-varea-primary`, `hover:bg-varea-primary-hover`, `bg-varea-secondary`, `text-varea-accent-ocre`, `text-varea-accent-iregua`, `bg-varea-bg-main`, `bg-varea-bg-alt`, `bg-varea-surface`, `border-varea-border`, `text-varea-text-main`, `text-varea-text-muted`, `bg-varea-badge-mercado` + `text-varea-badge-mercado-ink` + `border-varea-badge-mercado-line` (y equivalentes `gastro`, `tradicion`, `rio`). Prohibido hardcodear hex en componentes.
- Regla de oro WCAG: sobre dorados brillantes (`#F59E0B`, `#EAB308`) nunca texto blanco; usarlos solo como fondo con texto `--varea-text-main`.
- Los tokens semánticos (`--background`, `--foreground`, `--primary`, `--muted`, `--border`, `--ring`, `--chart-*`, `--sidebar-*`) ya están mapeados a la paleta en modo claro y oscuro; `body` usa `bg-background text-foreground`, así que el cambio aplica a todo el frontend (web pública e intranet).

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
