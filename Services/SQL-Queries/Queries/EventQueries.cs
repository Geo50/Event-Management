using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SQL_Queries.Queries
{
    public class EventQueries
    {
        public static string CreateNewEvent = "INSERT INTO public.event (eventname, eventdate, eventplace, eventtype, eventimage) VALUES (@eventname, @eventdate, @eventplace, @eventtype, @eventimage) RETURNING eventid ";

        public static string GetDate = "SELECT eventdate FROM public.event WHERE eventdate = @Date";

        public static string GetEventId = "SELECT eventid FROM public.event ";

        public static string GetPlace = "SELECT eventplace FROM public.event WHERE eventplace = @Place";

        public static string CreateNewTicket = "INSERT INTO public.tickets ( eventid, ticketname, ticketprice, category, benefits) VALUES (@eventid, @ticketname, @ticketprice, @category, @benefits)";

        public static string GetEventTickets = "SELECT ticketid, ticketname, ticketprice, category, benefits FROM public.tickets WHERE eventid = @eventid";

        public static string InsertEventDetails = "INSERT INTO public.event_details ( eventid, eventdescription) VALUES (@EventId, @eventdescription)";

        public static string GetEventsInHomepage => "SELECT eventid, eventname, eventdate, eventplace, eventtype, eventimage FROM public.event";

        public static string GetEventIdByName = "SELECT eventid FROM public.event WHERE eventname = @eventname;";

        public static string GetEventInDetails => @"SELECT e.eventid, e.eventname, e.eventdate, e.eventplace, e.eventtype, e.eventimage, 
                                                   ed.eventdescription
                                                   FROM public.event e 
                                                   JOIN public.event_details ed ON e.eventid = ed.eventid                                                 
                                                   WHERE e.eventid = :eventid";

    }
}
