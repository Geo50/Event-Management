
namespace Domain.Entities
{
    public class User
    {
        public  int UserId { get; set; }
        public  string UserName { get; set; }
        public  string UserEmail { get; set; }
        public  string UserPassword { get; set; }
        public Boolean isadmin { get; set; }
        public string PassVerificationAnswer { get; set; }

    }
}
