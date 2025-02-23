﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Palete.models;

#nullable disable

namespace Palete.Migrations
{
    [DbContext(typeof(PaleteDBContext))]
    [Migration("20240929085237_changeDatatype")]
    partial class changeDatatype
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.8")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("Palete.models.Bio", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Link")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.Property<string>("dp")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("UserId")
                        .IsUnique();

                    b.ToTable("Bio");
                });

            modelBuilder.Entity("Palete.models.Register", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Answer1")
                        .IsRequired()
                        .HasColumnType("nvarchar(250)");

                    b.Property<string>("Answer2")
                        .IsRequired()
                        .HasColumnType("nvarchar(250)");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("nvarchar(250)");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("nvarchar(250)");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("Palete.models.Bio", b =>
                {
                    b.HasOne("Palete.models.Register", "User")
                        .WithOne("Bio")
                        .HasForeignKey("Palete.models.Bio", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("Palete.models.Register", b =>
                {
                    b.Navigation("Bio");
                });
#pragma warning restore 612, 618
        }
    }
}
