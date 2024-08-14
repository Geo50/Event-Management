using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Transaction
    {
        public int transactionId {  get; set; }
        public int TicketId { get; set; }
        public int eventid { get; set; }
        public int UserId { get; set; }

    }
}
