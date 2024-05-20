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

        [DataMember]
        public bool Accepted { get; set; }

        [DataMember]
        public Guid TripId { get;set; }

        public RoadTrip()
        {
        }

        public RoadTrip(string currentLocation, string destination, Guid riderId, Guid driverId, double price, bool accepted)
        {
            CurrentLocation = currentLocation;
            Destination = destination;
            RiderId = riderId;
            DriverId = driverId;
            Price = price;
            Accepted = accepted;
            TripId = Guid.NewGuid();
        }

        public RoadTrip(string currentLocation, string destination, Guid riderId, Guid driverId, double price, bool accepted, Guid tripId) : this(currentLocation, destination, riderId, driverId, price, accepted)
        {
            TripId = tripId;
        }
    }
}
