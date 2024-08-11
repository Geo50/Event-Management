using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Tickets
    {
        public int TicketId {  get; set; }
        public int EventId { get; set; }
        public required string TicketName { get; set; }
        public int TicketPrice { get; set; }
        public required string Category { get; set; }
        public required string Benefits { get; set; }
    }
}
