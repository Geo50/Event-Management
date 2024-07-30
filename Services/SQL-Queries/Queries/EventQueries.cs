using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SQL_Queries.Queries
{
    public class EventQueries
    {
        public static string GetAllEvents => @"SELECT * FROM public.event";

        public static string GetEventById => @"	SELECT * FROM public.event WHERE eventid = @eventid";

        public static string GetEventDetails => @"	SELECT * FROM public.event WHERE eventid = @eventid";
    }
}
