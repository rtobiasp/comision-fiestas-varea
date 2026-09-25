using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddNoticiaCategoriaRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "NoticiaCategorias",
                schema: "contenido",
                columns: table => new
                {
                    NoticiaId = table.Column<Guid>(type: "uuid", nullable: false),
                    CategoriaId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NoticiaCategorias", x => new { x.NoticiaId, x.CategoriaId });
                    table.ForeignKey(
                        name: "FK_NoticiaCategorias_Categorias_CategoriaId",
                        column: x => x.CategoriaId,
                        principalSchema: "contenido",
                        principalTable: "Categorias",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_NoticiaCategorias_Noticias_NoticiaId",
                        column: x => x.NoticiaId,
                        principalSchema: "contenido",
                        principalTable: "Noticias",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_NoticiaCategorias_CategoriaId",
                schema: "contenido",
                table: "NoticiaCategorias",
                column: "CategoriaId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "NoticiaCategorias",
                schema: "contenido");
        }
    }
}
