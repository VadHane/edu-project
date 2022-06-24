namespace Lab3.Models
{
   public class UserCreateUpdateRequest
   {
      public string FirstName { get; set; }

      public string LastName { get; set; }

      public string Email { get; set; }

      // JSON
      public string Roles { get; set; }
   }
}
