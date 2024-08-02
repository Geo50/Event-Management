using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SQL_Queries.Queries
{
    public class EventQueries
    {
        public static string CreateNewEvent = "INSERT INTO public.event (eventname, eventdate, eventplace, eventtype, eventimage) VALUES (@eventname, @eventdate, @eventplace, @eventtype, @eventimage); " +
                                              "INSERT INTO public.event_details (eventid, eventdescription) VALUES (@eventid, @eventdescription); " +
                                              "INSERT INTO public.tickets (eventid, ticketname, ticketprice) VALUES (@eventid, @ticketname, @ticketprice);";

        public static string GetEventsInHomepage => "SELECT eventname, eventdate, eventplace, eventtype, eventimage FROM public.event";

        public static string GetEventIdByName = "SELECT eventid FROM public.event WHERE eventname = @eventname;";

        public static string GetEventInDetails = "SELECT e.eventname, e.eventdate, e.eventplace, e.eventtype, e.eventimage, ed.eventdescription " +
                                                 "FROM public.event e " +
                                                 "JOIN public.event_details ed ON e.eventid = ed.eventid " +
                                                 "WHERE e.eventid = @eventid; " +
                                                 "SELECT t.ticketname, t.ticketprice " +
                                                 "FROM public.tickets t " +
                                                 "WHERE t.eventid = @eventid;";

    }
}
