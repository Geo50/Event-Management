using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.EventDTOs
{
    public class TransactionDTO
    {
        public int TicketId { get; set; }   
        public int eventid { get; set; }
        public int UserId { get; set; }
    }
}
