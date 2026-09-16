using Application.Interfaces;
using Infrastructure.Repositories;
using System.Text.RegularExpressions;

var builder = WebApplication.CreateBuilder(args);

// La connection string de appsettings NO contiene secretos: usa placeholders
// ${VAR} / ${VAR:defecto} que se resuelven desde variables de entorno.
// Secretos (POSTGRES_USER, POSTGRES_PASSWORD) -> variables de entorno o User Secrets.
// Override total -> variable ConnectionStrings__DefaultConnection.
var rawConnectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? string.Empty;
var connectionString = ExpandEnvironmentVariables(rawConnectionString);

if (connectionString.Contains("${"))
{
    Console.WriteLine("AVISO: DefaultConnection tiene placeholders sin resolver. Define POSTGRES_USER y POSTGRES_PASSWORD en tu entorno (ver docker/.env.example).");
}

// Cuando se añada EF Core + Npgsql, registrar aquí, p. ej.:
// builder.Services.AddDbContext<AppDbContext>(o => o.UseNpgsql(connectionString));

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton<INoticiaRepository, NoticiaRepository>();

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

static string ExpandEnvironmentVariables(string input) =>
    Regex.Replace(
        input,
        @"\$\{(?<name>[A-Za-z_][A-Za-z0-9_]*)(?::(?<def>[^}]*))?\}",
        m => Environment.GetEnvironmentVariable(m.Groups["name"].Value)
             ?? (m.Groups["def"].Success ? m.Groups["def"].Value : m.Value));
