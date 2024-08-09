using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.UserDTOs
{
    public class UpdateEmailDTO
    {
        public int UserId { get; set; }
        public string UserEmail { get; set; }
    }
}
