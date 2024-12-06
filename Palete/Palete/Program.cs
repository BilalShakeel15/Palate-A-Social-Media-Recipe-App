using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Palete.models;
using System.Text.Json.Serialization;
using static Dropbox.Api.TeamLog.EventCategory;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = null; // Preserve property names
        options.JsonSerializerOptions.IgnoreNullValues = true; // Ignore null properties
    });



// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddDbContext<PaleteDBContext>(options =>
options.UseSqlServer(builder.Configuration.GetConnectionString("PaleteConnection")));



var app = builder.Build();

app.UseCors(options=>
options.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Add this to serve static files from the "postmedia" folder
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "postmedia")),
    RequestPath = "/postmedia" // URL prefix for accessing these files
});

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "StoryMedia")),
    RequestPath = "/StoryMedia" // URL prefix for accessing these files
});

app.UseHttpsRedirection();

//start static file serve
// Enable serving static files (for general static files like CSS, JS, etc.)
app.UseStaticFiles();

// Configure serving static files from the "profile" folder
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "profile")),
    RequestPath = "/profile"
});

app.UseRouting();
// end static files serve

app.UseAuthorization();

app.MapControllers();

app.Run();
