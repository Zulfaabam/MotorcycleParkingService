using Microsoft.AspNetCore.Identity;

public static class SeedData
{
  public static async Task Initialize(IServiceProvider serviceProvider)
  {
    var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();

    // Create roles
    string[] roleNames = { "Admin" };

    foreach (var roleName in roleNames)
    {
      if (!await roleManager.RoleExistsAsync(roleName))
      {
        await roleManager.CreateAsync(new IdentityRole(roleName));
      }
    }

    // Create admin user
    var adminEmail = "admin@parkir.com";
    var adminUser = await userManager.FindByEmailAsync(adminEmail);

    if (adminUser == null)
    {
      adminUser = new ApplicationUser
      {
        UserName = adminEmail,
        Email = adminEmail,
        FirstName = "API",
        LastName = "Administrator",
        EmailConfirmed = true,
        CreatedAt = DateTime.UtcNow
      };

      var result = await userManager.CreateAsync(adminUser, "Admin123!");

      if (result.Succeeded)
      {
        await userManager.AddToRoleAsync(adminUser, "Admin");
        Console.WriteLine($"Admin user created successfully with email: {adminEmail}");
        Console.WriteLine("Default password: Admin123!");
      }
    }
  }
}