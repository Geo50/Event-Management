using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class EventDetails
    {
        public int EventDetailId { get; set; }
        public int EventId { get; set; }
        public string EventDescription { get; set; }
        public int TicketId{ get; set; }

    }
}
