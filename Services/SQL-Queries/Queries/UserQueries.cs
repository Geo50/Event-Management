
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SQL_Queries.Queries
{
    public class UserQueries
    {
        public static string CreateNewUser => @"INSERT INTO public.user_details ( username, useremail, userpassword, isadmin, pass_verification_answer) VALUES ( @username, @useremail, @userpassword, @isadmin, @pass_verification_answer)";

        //USER COUNT INDIVIDUAL EVENT, NEEDS TO GO TO BOOKMARKS OR EVENT DETAILS TABLE
        public static string GetAllUsers => @"SELECT * FROM public.user_details WHERE userid = @userid";

        //WILL NEED TO CHECK IF USER ALREADY EXISTS, THEN GETS REDIRECTED TO LOGIN PAGE OR GETS ACCESS INTO WEBAPP IN HIS ACCOUNT
        public static string GetRegisteredUser => @" SELECT userid, username, useremail, userpassword, isadmin FROM public.user_details WHERE username = @UserName";

        public static string GetUserById => @"SELECT * FROM public.user_details WHERE userid = @userid";

        //CAN DISASSEMBLE THE QUERY OR FIX IT , LOW PRIORITY
        public static string Updateuserdetails => @"UPDATE public.user_details SET username = @username WHERE userid = @userid AND username != @username, useremail = @useremail WHERE userid = @userid AND useremail != @useremail, userpassword = @userpassword  WHERE userid = @userid AND userpassword != @userpassword";

        public static string GetPasswordVerificationAnswer => @"SELECT pass_verification_answer FROM public.user_details WHERE username = @UserName";

        public static string UpdateUserPassword => @"UPDATE public.user_details SET userpassword = @userpassword WHERE username = @UserName";
    }
}
