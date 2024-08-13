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
        public static string GetEventsInProfile => @"SELECT e.eventid, e.eventname, e.eventdate, e.eventplace, e.eventtype, e.eventimage, e.organiser_id, e.eventAttendeesLimit, ed.eventdescription
                                                     FROM public.event e 
                                                     JOIN public.event_details ed ON e.eventid = ed.eventid 
                                                     JOIN public.bookmarks b ON e.eventid = b.eventid 
                                                     WHERE b.userid = :UserId";
        public static string CreateTransaction => "INSERT INTO public.transaction ( ticketid, eventid, userid) VALUES ( @ticketid, @eventid, @userid)";

        public static string GetTransaction => "SELECT ticketid, eventid, userid FROM public.transaction WHERE userid = @userid";

        public static string GetTicketsBought => @"SELECT t.ticketid, t.ticketname, t.category, t.benefits, e.eventname, e.eventdate, e.eventplace 
                                                   FROM public.tickets t 
                                                   JOIN public.transaction tr ON t.ticketid = tr.ticketid 
                                                   JOIN public.event e ON tr.eventid = e.eventid 
                                                   WHERE tr.userid = @userid;";
    }
}
