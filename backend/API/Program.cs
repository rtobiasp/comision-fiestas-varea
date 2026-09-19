using API.Services;
using Application.Common.Interfaces;
using Infrastructure;
using Infrastructure.Persistence.Interceptors;
using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
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
});

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<INoticiaRepository, NoticiaRepository>();
builder.Services.AddScoped<ICategoriaRepository, CategoriaRepository>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();