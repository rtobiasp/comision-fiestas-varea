using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ActualizarCamposNoticia : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EsBorrador",
                schema: "contenido",
                table: "Noticias");

            migrationBuilder.AddColumn<bool>(
                name: "Fijada",
                schema: "contenido",
                table: "Noticias",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Subtitulo",
                schema: "contenido",
                table: "Noticias",
                type: "character varying(300)",
                maxLength: 300,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Fijada",
                schema: "contenido",
                table: "Noticias");

            migrationBuilder.DropColumn(
                name: "Subtitulo",
                schema: "contenido",
                table: "Noticias");

            migrationBuilder.AddColumn<bool>(
                name: "EsBorrador",
                schema: "contenido",
                table: "Noticias",
                type: "boolean",
                nullable: false,
                defaultValue: true);
        }
    }
}
