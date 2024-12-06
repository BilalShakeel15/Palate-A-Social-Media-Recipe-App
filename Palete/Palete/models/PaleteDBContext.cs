using Microsoft.EntityFrameworkCore;

namespace Palete.models
{
    public class PaleteDBContext: DbContext
    {
        public PaleteDBContext(DbContextOptions<PaleteDBContext>options):base(options)
        {
            
        }
        
        public DbSet <Register> Users { get; set; }

        public DbSet <Bio> Bio { get; set; }

        public DbSet<Posts> Posts { get; set; }

        public DbSet<PostMedia> PostMedia { get; set; }

        public DbSet<Recipes> Recipes { get; set; }

        public DbSet<RecipeMedia> RecipeMedia { get; set; }

        public DbSet<Follow> Follows { get; set; }

        public DbSet<Notification> Notifications { get; set; }

        public DbSet<Likes> Likes { get; set; }

        public DbSet<Story> Story { get; set; }

        public DbSet<RecipeRating> RecipeRating { get; set; }

        public DbSet<Comments> Comments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Register>()
                .HasOne(u => u.Bio)
                .WithOne(b => b.User)
                .HasForeignKey<Bio>(b => b.UserId)
                .OnDelete(DeleteBehavior.Cascade);   // Set foreign key

            

            modelBuilder.Entity<Posts>()
              .HasOne(p => p.User)
              .WithMany(r => r.Posts)
              .HasForeignKey(p => p.UserId)
              .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<PostMedia>()
                .HasOne(p => p.Post)
                .WithMany(r => r.PostMedia)
                .HasForeignKey(p => p.PostId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Recipes>()
              .HasOne(p => p.User)
              .WithMany(r => r.Recipes)
              .HasForeignKey(p => p.UserId)
              .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Recipes>()
            .HasMany(r => r.Media)
            .WithOne(m => m.Recipe)
            .HasForeignKey(m => m.RecipeId)
            .OnDelete(DeleteBehavior.Cascade);


            modelBuilder.Entity<Follow>()
            .HasOne(f => f.Follower)  // Follower is related to User
            .WithMany()  // A user can have many followers
            .HasForeignKey(f => f.FollowerId)  // Foreign Key on FollowerId
            .OnDelete(DeleteBehavior.Restrict);  // Prevent cascading delete (you may change this based on your business logic)

            modelBuilder.Entity<Follow>()
                .HasOne(f => f.Followed)  // Followed is related to User
                .WithMany()  // A user can have many followings
                .HasForeignKey(f => f.FollowedId)  // Foreign Key on FollowedId
                .OnDelete(DeleteBehavior.Restrict);  // Prevent cascading delete (you may change this based on your business logic)

            // Define Foreign Key for Notification
            modelBuilder.Entity<Notification>()
                .HasOne(n => n.User)  // User is related to Notification
                .WithMany()  // A user can have many notifications
                .HasForeignKey(n => n.UserId)  // Foreign Key on UserId
                .OnDelete(DeleteBehavior.Cascade);  // When a user is deleted, set UserId to null in Notifications

            modelBuilder.Entity<Likes>()
        .HasOne(l => l.User)         // Like has one User
        .WithMany(u => u.Likes)      // User has many Likes
        .HasForeignKey(l => l.UserId) // Foreign key in Like
        .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Likes>()
                .HasOne(l => l.Post)         // Like has one Post
                .WithMany(p => p.Likes)      // Post has many Likes
                .HasForeignKey(l => l.PostId) // Foreign key in Like
                .OnDelete(DeleteBehavior.NoAction);


            modelBuilder.Entity<RecipeRating>()
                .HasIndex(r => new { r.RecipeId, r.UserId })
                .IsUnique();


            modelBuilder.Entity<RecipeRating>()
        .HasOne(r => r.Recipe)
        .WithMany(r => r.RecipeRatings)
        .HasForeignKey(r => r.RecipeId)
        .OnDelete(DeleteBehavior.NoAction); ;

            modelBuilder.Entity<RecipeRating>()
                .HasOne(r => r.User)
                .WithMany(u => u.RecipeRatings)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.NoAction);


            modelBuilder.Entity<Comments>()
            .HasOne(c => c.Post)  // Each comment is related to one post
            .WithMany(p => p.Comments)  // A post can have many comments
            .HasForeignKey(c => c.PostId)  // Foreign Key is the PostId in Comment table
            .OnDelete(DeleteBehavior.Cascade);
        }








    }
}
