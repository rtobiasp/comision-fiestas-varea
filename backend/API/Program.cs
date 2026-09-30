using API.Services;
using Application.Common.Interfaces;
using Infrastructure;
using Infrastructure.Persistence.Interceptors;
using Infrastructure.Repositories;
using Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Scalar.AspNetCore;
using Wolverine;
using Wolverine.FluentValidation;

var builder = WebApplication.CreateBuilder(args);

// La connection string se resuelve por configuración nativa, sin paquetes externos:
// Desarrollo local -> User Secrets (dotnet user-secrets set "ConnectionStrings:DefaultConnection" "...").
// Producción -> variable de entorno ConnectionStrings__DefaultConnection inyectada por el host
// (contenedor, Docker Secrets, Vault, Azure Key Vault, etc.). Nunca usar archivos .env.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Add PostgreSQL context con interceptor de auditoría/soft-delete
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();
builder.Services.AddScoped<AuditableEntityInterceptor>();
builder.Services.AddDbContext<PostgreContext>((sp, o) => o
    .UseNpgsql(connectionString)
    .AddInterceptors(sp.GetRequiredService<AuditableEntityInterceptor>()));

// Wolverine como mediador in-process.
builder.Host.UseWolverine(opts =>
{
    opts.Durability.Mode = DurabilityMode.MediatorOnly;
    opts.Discovery.IncludeAssembly(typeof(Application.Features.Noticias.Commands.CreateNoticia.CreateNoticiaCommand).Assembly);

    // Fluent Validarion validators
    opts.UseFluentValidation();

    // Si se añaden más repositorios sobre PostgreContext, añadir aquí su línea.
    opts.CodeGeneration.AlwaysUseServiceLocationFor<INoticiaRepository>();
    opts.CodeGeneration.AlwaysUseServiceLocationFor<ICategoriaRepository>();
    opts.CodeGeneration.AlwaysUseServiceLocationFor<ITagRepository>();
    opts.CodeGeneration.AlwaysUseServiceLocationFor<IEventoRepository>();
    opts.CodeGeneration.AlwaysUseServiceLocationFor<INotificacionRepository>();
    opts.CodeGeneration.AlwaysUseServiceLocationFor<IMediaAssetRepository>();
});

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();

// CORS para el frontend Next.js. Orígenes vía configuración "Frontend:Origins"
// (appsettings.Development.json en local, env var Frontend__Origins en prod).
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendDev", policy =>
    {
        var origins = builder.Configuration.GetSection("Frontend:Origins").Get<string[]>()
            ?? ["http://localhost:3000"];
        policy.WithOrigins(origins)
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

builder.Services.AddScoped<INoticiaRepository, NoticiaRepository>();
builder.Services.AddScoped<ICategoriaRepository, CategoriaRepository>();
builder.Services.AddScoped<ITagRepository, TagRepository>();
builder.Services.AddScoped<IEventoRepository, EventoRepository>();
builder.Services.AddScoped<INotificacionRepository, NotificacionRepository>();
builder.Services.AddScoped<IMediaAssetRepository, MediaAssetRepository>();
builder.Services.AddScoped<IStorageService, LocalFileStorageService>();

var app = builder.Build();


var docsEnabled = app.Environment.IsDevelopment()
    || builder.Configuration.GetValue<bool>("Docs:Enabled");

if (docsEnabled)
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

// Sirve los ficheros guardados por LocalFileStorageService.
// Misma resolución que el servicio: relativa a AppContext.BaseDirectory,
// absoluta tal cual. Sin esto, las UrlRelativa /uploads/* devuelven 404.
var uploadsRoot = builder.Configuration.GetValue<string>("Storage:RootPath");
if (string.IsNullOrWhiteSpace(uploadsRoot))
    uploadsRoot = Path.Combine("wwwroot", "uploads");

var uploadsPath = Path.GetFullPath(
    Path.IsPathRooted(uploadsRoot)
        ? uploadsRoot
        : Path.Combine(AppContext.BaseDirectory, uploadsRoot));

Directory.CreateDirectory(uploadsPath);

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadsPath),
    RequestPath = "/uploads"
});

app.UseCors("FrontendDev");

app.UseAuthorization();

app.MapControllers();

app.Run();