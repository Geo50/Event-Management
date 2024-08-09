using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Bookings
    {
        public int UserId { get; set; }
        public int EventId { get; set; }
        public int TicketId { get; set; }
        public string UserName { get; set; }
        public int BookingId { get; set; }
    }
}
