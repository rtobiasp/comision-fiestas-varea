using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCategoriaPadre : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CategoriaPadreId",
                schema: "contenido",
                table: "Categorias",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Categorias_CategoriaPadreId",
                schema: "contenido",
                table: "Categorias",
                column: "CategoriaPadreId");

            migrationBuilder.AddForeignKey(
                name: "FK_Categorias_Categorias_CategoriaPadreId",
                schema: "contenido",
                table: "Categorias",
                column: "CategoriaPadreId",
                principalSchema: "contenido",
                principalTable: "Categorias",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Categorias_Categorias_CategoriaPadreId",
                schema: "contenido",
                table: "Categorias");

            migrationBuilder.DropIndex(
                name: "IX_Categorias_CategoriaPadreId",
                schema: "contenido",
                table: "Categorias");

            migrationBuilder.DropColumn(
                name: "CategoriaPadreId",
                schema: "contenido",
                table: "Categorias");
        }
    }
}
