using Common.DTO;
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
    public interface IUser : IService
    {
        [OperationContract]
        Task<bool> addNewUser(User user);

        [OperationContract]
        Task<FullUserDTO> loginUser(LoginUserDTO loginUserDTO);

        [OperationContract] 
        Task<List<FullUserDTO>> listUsers();

        [OperationContract]
        Task<List<DriverViewDTO>> listDrivers();

        [OperationContract]
        Task<bool> changeDriverStatus(string email, bool status);
    }
}
