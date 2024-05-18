using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.DTO
{
    public class DriverChangeStatusDTO
    {
        public string Email { get; set; }  
        public bool Status { get;set; }
        public DriverChangeStatusDTO() { }
    }
}
