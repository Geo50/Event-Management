using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Event
    {
        public required int EventId { get; set; }
        public required string EventName { get; set; }
        public int EventAttendees { get; set; }
        public required string EventType { get; set; }
        public required IEnumerable<EventDetails> EventDetails { get; set; }

    }
}
