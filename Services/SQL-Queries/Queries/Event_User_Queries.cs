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

        public static string CreateNewBookmark => "INSERT INTO public.bookmarks (eventid, userid, eventname) VALUES  (@eventid, @userid, @eventname) ";
        public static string GetEventsInProfile => @"SELECT e.eventid, e.eventname, e.eventdate, e.eventplace, e.eventtype, e.eventimage, ed.eventdescription, t.ticketname, t.ticketprice 
                                                     FROM public.event e 
                                                     JOIN public.event_details ed ON e.eventid = ed.eventid 
                                                     LEFT JOIN public.tickets t ON ed.ticketid = t.ticketid 
                                                     JOIN public.bookmarks b ON e.eventid = b.eventid 
                                                     WHERE b.userid = :UserId";

    }
}
