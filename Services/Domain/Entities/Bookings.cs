using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Bookings
    {   
        public required int EventId{ get; set; }
        public required int UserId{ get; set; }

    }
}
