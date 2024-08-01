namespace Application.DTO
{
    public class CreateUserDTO
    {
        public  string UserName { get; set; }
        public  string UserEmail { get; set; }
        public  string UserPassword { get; set; }
        public  bool isadmin { get; set; }
        public string PassVerificationAnswer { get; set; }

    }
}
