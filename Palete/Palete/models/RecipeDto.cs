using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

public class RecipeDto
{
    [Required]
    public string Title { get; set; }

    public string? Description { get; set; }

    public string? Instructions { get; set; }

    public string? Ingredients { get; set; }

    public string? Notes { get; set; }

    [Required]
    public int TimeInMinutes { get; set; }

    [Required]
    public string Difficulty { get; set; }

    [Required]
    public int Serves { get; set; }

    public string category { get; set; }

    public int UserId { get; set; }

    public List<IFormFile>? MediaFiles { get; set; }
}
