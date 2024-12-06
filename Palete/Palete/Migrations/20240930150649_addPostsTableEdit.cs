using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Palete.Migrations
{
    /// <inheritdoc />
    public partial class addPostsTableEdit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Caption",
                table: "Posts",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "Posts",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Caption",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Posts");
        }
    }
}
