using API.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace API.Tests.Integration
{
    // VERSAO USANDO IDENTITY
    public class ApiWebApplicationFactory : WebApplicationFactory<Program>
    {
        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.UseEnvironment("Testing");

            builder.ConfigureServices(async services =>
            {
                var sp = services.BuildServiceProvider();

                using (var scope = sp.CreateScope())
                {
                    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                    db.Database.EnsureCreated();

                    var servicesScoped = scope.ServiceProvider;

                    var roleManager = servicesScoped.GetRequiredService<RoleManager<IdentityRole>>();

                    if (!await roleManager.RoleExistsAsync("Member"))
                    {
                        await roleManager.CreateAsync(new IdentityRole("Member"));
                    }
                }
            });
        }
    }

    // VERSAO PARA USAR USANDO SOMENTE REPOSITORY PATTERN, SEM IDENTITY
    //public class ApiWebApplicationFactory : WebApplicationFactory<Program>
    //{
    //    protected override void ConfigureWebHost(IWebHostBuilder builder)
    //    {
    //        builder.ConfigureServices(services =>
    //        {
    //            // Remove o DbContext real
    //            var descriptor = services.SingleOrDefault(
    //                d => d.ServiceType == typeof(DbContextOptions<AppDbContext>)
    //            );

    //            if (descriptor != null)
    //                services.Remove(descriptor);

    //            // Adiciona DbContext InMemory
    //            services.AddDbContext<AppDbContext>(options =>
    //            {
    //                options.UseInMemoryDatabase("IntegrationTestsDb");
    //            });
    //        });
    //    }
    //}
}
