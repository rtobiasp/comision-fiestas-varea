using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class EventosParidadNoticias : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Publicado",
                schema: "eventos",
                table: "Eventos",
                newName: "Publicada");

            migrationBuilder.RenameColumn(
                name: "Destacado",
                schema: "eventos",
                table: "Eventos",
                newName: "Fijada");

            migrationBuilder.AddColumn<string>(
                name: "ImagenPortada",
                schema: "eventos",
                table: "Eventos",
                type: "character varying(2048)",
                maxLength: 2048,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImagenPortada",
                schema: "eventos",
                table: "Eventos");

            migrationBuilder.RenameColumn(
                name: "Publicada",
                schema: "eventos",
                table: "Eventos",
                newName: "Publicado");

            migrationBuilder.RenameColumn(
                name: "Fijada",
                schema: "eventos",
                table: "Eventos",
                newName: "Destacado");
        }
    }
}
