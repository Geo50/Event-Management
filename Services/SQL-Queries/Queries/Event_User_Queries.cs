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

        public static string DeleteBookmark => "DELETE FROM public.bookmarks WHERE eventid = @eventid AND userid = @userid";
        public static string GetEventsInProfile => @"SELECT e.eventid, e.eventname, e.eventdate, e.eventplace, e.eventtype, e.eventimage, e.organiser_id, e.eventAttendeesLimit, ed.eventdescription
                                                     FROM public.event e 
                                                     JOIN public.event_details ed ON e.eventid = ed.eventid 
                                                     JOIN public.bookmarks b ON e.eventid = b.eventid 
                                                     WHERE b.userid = :UserId";
        public static string CreateTransaction => "INSERT INTO public.transaction ( ticketid, eventid, userid) VALUES ( @ticketid, @eventid, @userid)";

        public static string GetTransaction => "SELECT ticketid, eventid, userid FROM public.transaction WHERE userid = @userid";

        public static string GetBoughtTickets => @"SELECT t.ticketid, t.ticketname, t.category, t.benefits, e.eventname, e.eventdate, e.eventplace, e.eventid
                                                   FROM public.tickets t 
                                                   JOIN public.transaction tr ON t.ticketid = tr.ticketid 
                                                   JOIN public.event e ON tr.eventid = e.eventid 
                                                   WHERE tr.userid = @userid;";
        public static string DeleteBoughtTicket => "DELETE FROM public.transaction WHERE eventid = @eventid AND ticketid = @ticketid AND userid = @userid";
        public static string UpdateTicketStatus => "UPDATE public.tickets SET ticket_limit = ticket_limit - 1 WHERE eventid = @eventid AND ticketid= @ticketid AND ticket_limit > 0";
        public static string IncrementTicketStatus => "UPDATE public.tickets SET  ticket_limit = ticket_limit + 1 WHERE eventid = @eventid AND ticketid= @ticketid ";
        public static string GetTransactionsPerEvent => "SELECT COUNT(*) FROM public.transaction WHERE eventid = @eventid";

        public static string GetTransactionsPerUserEvent => "SELECT COUNT(*) FROM public.transaction WHERE eventid = @eventid AND userid = @userid";

    }
}
