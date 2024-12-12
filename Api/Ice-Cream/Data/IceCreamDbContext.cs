using Ice_Cream.Models;
using Microsoft.EntityFrameworkCore;

namespace Ice_Cream.Data
{
    public class IceCreamDbContext : DbContext
    {
        public IceCreamDbContext(DbContextOptions<IceCreamDbContext> options) : base(options) { }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Comments> Comments { get; set; }
        public DbSet<FAQ> FAQs { get; set; }
        public DbSet<Feedback> Feedbacks { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<PaymentInfo> PaymentInfos { get; set; }
        public DbSet<Rating> Ratings { get; set; }
        public DbSet<Recipe> Recipes { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Subscription> Subscriptions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Account configuration
            modelBuilder.Entity<Account>(entity =>
            {
                entity.ToTable("Account");
                entity.HasKey(e => e.Id);

                entity.HasOne(d => d.Subscription)
                    .WithMany(p => p.Accounts)
                    .HasForeignKey(d => d.SubscriptionId);

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.Accounts)
                    .HasForeignKey(d => d.RoleId);
            });

            // Comments configuration
            modelBuilder.Entity<Comments>(entity =>
            {
                entity.ToTable("Comments");
                entity.HasKey(e => e.Id);

                entity.HasOne(d => d.Account)
                    .WithMany(p => p.Comments)
                    .HasForeignKey(d => d.AccountId);
            });

            // FAQ configuration
            modelBuilder.Entity<FAQ>(entity =>
            {
                entity.ToTable("FAQ");
                entity.HasKey(e => e.Id);

                entity.HasOne(d => d.Recipe)
                    .WithMany(p => p.FAQs)
                    .HasForeignKey(d => d.RecipeId);
            });

            // Order configuration
            modelBuilder.Entity<Order>(entity =>
            {
                entity.ToTable("Order");
                entity.HasKey(e => e.Id);

                entity.HasOne(d => d.Payment)
                    .WithMany(p => p.Orders)
                    .HasForeignKey(d => d.PaymentId);

                entity.HasOne(d => d.PaymentInfo)
                    .WithMany()
                    .HasForeignKey(d => d.PaymentInfoId);
            });

            // PaymentInfo configuration
            modelBuilder.Entity<PaymentInfo>(entity =>
            {
                entity.ToTable("PaymentInfo");
                entity.HasKey(e => e.Id);

                entity.HasOne(d => d.Account)
                    .WithMany(p => p.PaymentInfos)
                    .HasForeignKey(d => d.AccountId);

                entity.HasOne(d => d.Order)
                    .WithMany(p => p.PaymentInfos)
                    .HasForeignKey(d => d.OrderId);

                entity.HasOne(d => d.Payment)
                    .WithMany(p => p.PaymentInfos)
                    .HasForeignKey(d => d.PaymentId);
            });

            // Rating configuration
            modelBuilder.Entity<Rating>(entity =>
            {
                entity.ToTable("Rating");
                entity.HasKey(e => e.Id);

                entity.HasOne(d => d.Recipe)
                    .WithMany()
                    .HasForeignKey(d => d.RecipeId);

                entity.HasOne(d => d.Account)
                    .WithMany(p => p.Ratings)
                    .HasForeignKey(d => d.AccountId);
            });

            // Recipe configuration
            modelBuilder.Entity<Recipe>(entity =>
            {
                entity.ToTable("Recipe");
                entity.HasKey(e => e.Id);

                entity.HasOne(d => d.Comment)
                    .WithMany(p => p.Recipes)
                    .HasForeignKey(d => d.CommentId);

                entity.HasOne(d => d.Rating)
                    .WithMany(p => p.Recipes)
                    .HasForeignKey(d => d.RatingId);
            });

            // Role configuration
            modelBuilder.Entity<Role>(entity =>
            {
                entity.ToTable("Role");
                entity.HasKey(e => e.Id);
            });

            // Subscription configuration
            modelBuilder.Entity<Subscription>(entity =>
            {
                entity.ToTable("Subscription");
                entity.HasKey(e => e.Id);
            });
        }
    }
}

