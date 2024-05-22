using Common.Models;
using Microsoft.ServiceFabric.Services.Remoting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.Text;
using System.Threading.Tasks;

namespace Common.Interfaces
{
    [ServiceContract]
    public interface IDrive : IService
    {
        [OperationContract]
        Task<RoadTrip> AcceptRoadTrip(RoadTrip trip);

        [OperationContract]
        Task<RoadTrip> GetCurrentRoadTrip(Guid id);

        [OperationContract]
        Task<List<RoadTrip>> GetRoadTrips();

        [OperationContract]
        Task<RoadTrip> AcceptRoadTripDriver(Guid rideId, Guid driverId);
    }
}
