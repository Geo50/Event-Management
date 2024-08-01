namespace Application.DTO
{
    public class PasswordForgotDTO
    {
        public string UserName { get; set; }
        public string UserPassword { get; set; }
        public string PassVerificationAnswer { get; set; }
    }
}
