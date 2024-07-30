using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SQL_Queries.Queries
{
    public class Event_User_Queries
    {
        public static string GetAttendeesCount => @"SELECT eventattendees FROM public.event WHERE eventid = @eventid";

    }
}
