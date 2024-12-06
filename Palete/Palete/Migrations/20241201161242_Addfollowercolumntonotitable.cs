using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Palete.Migrations
{
    /// <inheritdoc />
    public partial class Addfollowercolumntonotitable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "DateUpdated",
                table: "Notifications",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "FollowerId",
                table: "Notifications",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DateUpdated",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "FollowerId",
                table: "Notifications");
        }
    }
}
