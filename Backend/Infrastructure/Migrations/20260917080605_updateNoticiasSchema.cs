using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class updateNoticiasSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "publicada",
                schema: "contenido",
                table: "Noticias",
                newName: "Publicada");

            migrationBuilder.RenameColumn(
                name: "esBorrador",
                schema: "contenido",
                table: "Noticias",
                newName: "EsBorrador");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Publicada",
                schema: "contenido",
                table: "Noticias",
                newName: "publicada");

            migrationBuilder.RenameColumn(
                name: "EsBorrador",
                schema: "contenido",
                table: "Noticias",
                newName: "esBorrador");
        }
    }
}
