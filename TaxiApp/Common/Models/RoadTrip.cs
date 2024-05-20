using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace Common.Models
{
    [DataContract]
    public class RoadTrip
    {
        [DataMember]    
        public string CurrentLocation { get; set; }

        [DataMember]    
        public string Destination { get; set; }

        [DataMember]
        public Guid RiderId { get; set; }

        [DataMember]
        public Guid DriverId { get; set; }

        [DataMember]
        public double Price { get; set; }   

        public RoadTrip()
        {
        }
    }
}
