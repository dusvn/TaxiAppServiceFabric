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
    public interface IEstimation : IService
    {
        [OperationContract]
        Task<double> GetEstimatedPrice(string currentLocation, string destination);
    }
}
