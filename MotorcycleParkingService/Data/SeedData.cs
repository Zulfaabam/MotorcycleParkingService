using Microsoft.AspNetCore.Identity;

public static class SeedData
{
  public static async Task Initialize(IServiceProvider serviceProvider)
  {
    RoleManager<IdentityRole> roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    UserManager<ApplicationUser> userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();

    // Create roles
    string[] roleNames = { "Admin", "User" };

    foreach( var roleName in roleNames )
    {
      if( !await roleManager.RoleExistsAsync(roleName) )
      {
        await roleManager.CreateAsync(new IdentityRole(roleName));
      }
    }

    // Create admin user
    string adminEmail = "admin@parkir.com";
    ApplicationUser? adminUser = await userManager.FindByEmailAsync(adminEmail);

    if( adminUser == null )
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

      IdentityResult result = await userManager.CreateAsync(adminUser, "Admin123!");

      if( result.Succeeded )
      {
        await userManager.AddToRoleAsync(adminUser, "Admin");
        Console.WriteLine($"Admin user created successfully with email: {adminEmail}");
        Console.WriteLine("Default password: Admin123!");
      }
    }

    // Create sample user
    var userEmail = "user@parkir.com";
    ApplicationUser? sampleUser = await userManager.FindByEmailAsync(userEmail);

    if( sampleUser == null )
    {
      sampleUser = new ApplicationUser
      {
        UserName = userEmail,
        Email = userEmail,
        FirstName = "User",
        LastName = "User",
        EmailConfirmed = true,
        CreatedAt = DateTime.UtcNow
      };

      IdentityResult result = await userManager.CreateAsync(sampleUser, "User123!");

      if( result.Succeeded )
      {
        await userManager.AddToRoleAsync(sampleUser, "User");
        Console.WriteLine($"Sample user created successfully with email: {userEmail}");
        Console.WriteLine("Default password: User123!");
      }
    }
  }
}