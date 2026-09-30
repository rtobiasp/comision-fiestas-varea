# Build + runtime de la API (.NET 10).
# Contexto de build: backend/  (docker build -f API/Dockerfile . desde backend/)
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY API/API.csproj API/
COPY Application/Application.csproj Application/
COPY Domain/Domain.csproj Domain/
COPY Infrastructure/Infrastructure.csproj Infrastructure/
RUN dotnet restore API/API.csproj
COPY . .
WORKDIR /src/API
RUN dotnet publish API.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_HTTP_PORTS=8080 \
    Storage__RootPath=/app/uploads
COPY --from=build /app/publish .
VOLUME ["/app/uploads"]
ENTRYPOINT ["dotnet", "API.dll"]
