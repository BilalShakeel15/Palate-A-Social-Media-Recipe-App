using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Palete.Migrations
{
    /// <inheritdoc />
    public partial class addRecipeRatingTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RecipeRating",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RecipeId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Rating = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RecipeRating", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RecipeRating_Recipes_RecipeId",
                        column: x => x.RecipeId,
                        principalTable: "Recipes",
                        principalColumn: "RecipeId");
                    table.ForeignKey(
                        name: "FK_RecipeRating_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_RecipeRating_RecipeId_UserId",
                table: "RecipeRating",
                columns: new[] { "RecipeId", "UserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RecipeRating_UserId",
                table: "RecipeRating",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RecipeRating");
        }
    }
}
