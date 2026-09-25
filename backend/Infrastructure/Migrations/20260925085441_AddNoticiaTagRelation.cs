using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddNoticiaTagRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "NoticiaTags",
                schema: "contenido",
                columns: table => new
                {
                    NoticiaId = table.Column<Guid>(type: "uuid", nullable: false),
                    TagId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NoticiaTags", x => new { x.NoticiaId, x.TagId });
                    table.ForeignKey(
                        name: "FK_NoticiaTags_Noticias_NoticiaId",
                        column: x => x.NoticiaId,
                        principalSchema: "contenido",
                        principalTable: "Noticias",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_NoticiaTags_Tags_TagId",
                        column: x => x.TagId,
                        principalSchema: "contenido",
                        principalTable: "Tags",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_NoticiaTags_TagId",
                schema: "contenido",
                table: "NoticiaTags",
                column: "TagId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "NoticiaTags",
                schema: "contenido");
        }
    }
}
