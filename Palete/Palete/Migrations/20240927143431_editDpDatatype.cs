using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Palete.Migrations
{
    public partial class editDpDatatype : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Step 1: Add a temporary column for the new binary data type
            migrationBuilder.AddColumn<byte[]>(
                name: "dp_temp",
                table: "Bio",
                type: "varbinary(max)",
                nullable: true);

            // Step 2: Copy data from the old 'dp' column to 'dp_temp', converting nvarchar(max) to varbinary(max)
            migrationBuilder.Sql("UPDATE Bio SET dp_temp = CONVERT(varbinary(max), dp)");

            // Step 3: Drop the old 'dp' column
            migrationBuilder.DropColumn(
                name: "dp",
                table: "Bio");

            // Step 4: Rename the 'dp_temp' column back to 'dp'
            migrationBuilder.RenameColumn(
                name: "dp_temp",
                table: "Bio",
                newName: "dp");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Reverting the changes

            // Step 1: Add the old nvarchar(max) column back
            migrationBuilder.AddColumn<string>(
                name: "dp_temp",
                table: "Bio",
                type: "nvarchar(max)",
                nullable: true);

            // Step 2: Convert the binary data back to string (if needed)
            migrationBuilder.Sql("UPDATE Bio SET dp_temp = CONVERT(nvarchar(max), dp)");

            // Step 3: Drop the 'dp' column
            migrationBuilder.DropColumn(
                name: "dp",
                table: "Bio");

            // Step 4: Rename 'dp_temp' back to 'dp'
            migrationBuilder.RenameColumn(
                name: "dp_temp",
                table: "Bio",
                newName: "dp");
        }
    }
}
