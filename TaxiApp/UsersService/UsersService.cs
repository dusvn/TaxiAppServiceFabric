using System;
using System.Collections.Generic;
using System.Fabric;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.ServiceFabric.Data.Collections;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Runtime;
using System.Net;
using Common.Interfaces;
using Common.Models;
using Microsoft.ServiceFabric.Services.Remoting.Runtime;
using Common.DTO;
using System.Threading.Channels;
using System.ComponentModel;
using System.Diagnostics;
using Common.Enums;
using System.Collections;
using Microsoft.WindowsAzure.Storage.Table;
using System.Collections.Concurrent;
using Common;
using Common.Entities;
using Azure.Storage.Blobs.Specialized;
using Microsoft.WindowsAzure.Storage.Blob;
using Azure.Data.Tables;
using Common.Mapper;
using Microsoft.ServiceFabric.Data;

namespace UsersService
{
    /// <summary>
    /// An instance of this class is created for each service replica by the Service Fabric runtime.
    /// </summary>
    public sealed class UsersService : StatefulService, IUser
    {
        public UsersDataRepository dataRepo;

        public UsersService(StatefulServiceContext context)
            : base(context)
        {

            dataRepo = new UsersDataRepository("UsersTaxiApp");
        }



        public async Task<bool> addNewUser(User user)
        {
            var userDictionary = await StateManager.GetOrAddAsync<IReliableDictionary<string, User>>("UserEntities");

            try
            {
                using (var transaction = StateManager.CreateTransaction())
                {

                    await userDictionary.AddAsync(transaction,user.Email,user); // dodaj ga prvo u reliable 

                    //insert image of user in blob
                    CloudBlockBlob blob = await dataRepo.GetBlockBlobReference("users", $"image_{user.Username}");
                    blob.Properties.ContentType = user.ImageFile.ContentType;
                    await blob.UploadFromByteArrayAsync(user.ImageFile.FileContent, 0, user.ImageFile.FileContent.Length);
                    string imageUrl = blob.Uri.AbsoluteUri; 

                    //insert user in database
                    UserEntity newUser = new UserEntity(user, imageUrl);
                    TableOperation operation = TableOperation.Insert(newUser);
                    await dataRepo.Users.ExecuteAsync(operation);

            
                    await transaction.CommitAsync();

                }
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        

        private async Task LoadUsers()
        {
            var userDictionary = await StateManager.GetOrAddAsync<IReliableDictionary<string, User>>("UserEntities");
            try
            {
                using (var transaction = StateManager.CreateTransaction())
                {
                    var users = dataRepo.GetAllUsers();
                    if (users.Count() == 0) return;
                    else
                    {
                        foreach (var user in users)
                        {
                            byte[] image = await dataRepo.DownloadImage(dataRepo, user, "users");
                            await userDictionary.AddAsync(transaction, user.Email, UserMapper.MapUserEntityToUser(user,image)); 
                        } 
                    }

                    await transaction.CommitAsync();

                }

            }
            catch (Exception)
            {
                throw;
            }
        }


        /// <summary>
        /// Optional override to create listeners (e.g., HTTP, Service Remoting, WCF, etc.) for this service replica to handle client or user requests.
        /// </summary>
        /// <remarks>
        /// For more information on service communication, see https://aka.ms/servicefabricservicecommunication
        /// </remarks>
        /// <returns>A collection of listeners.</returns>
        protected override IEnumerable<ServiceReplicaListener> CreateServiceReplicaListeners()
            => this.CreateServiceRemotingReplicaListeners();

        /// <summary>
        /// This is the main entry point for your service replica.
        /// This method executes when this replica of your service becomes primary and has write status.
        /// </summary>
        /// <param name="cancellationToken">Canceled when Service Fabric needs to shut down this service replica.</param>
        protected override async Task RunAsync(CancellationToken cancellationToken)
        {
            // TODO: Replace the following sample code with your own logic 
            //       or remove this RunAsync override if it's not needed in your service.

            var myDictionary = await this.StateManager.GetOrAddAsync<IReliableDictionary<string, long>>("myDictionary");
            var users = await this.StateManager.GetOrAddAsync<IReliableDictionary<string, User>>("UserEntities");
            // ovde ce biti load users 
            await LoadUsers();
            while (true)
            {
                cancellationToken.ThrowIfCancellationRequested();

                using (var tx = this.StateManager.CreateTransaction())
                {
                    var result = await myDictionary.TryGetValueAsync(tx, "Counter");

                    ServiceEventSource.Current.ServiceMessage(this.Context, "Current Counter Value: {0}",
                        result.HasValue ? result.Value.ToString() : "Value does not exist.");

                    await myDictionary.AddOrUpdateAsync(tx, "Counter", 0, (key, value) => ++value);

                    // If an exception is thrown before calling CommitAsync, the transaction aborts, all changes are 
                    // discarded, and nothing is saved to the secondary replicas.
                    await tx.CommitAsync();
                }

                await Task.Delay(TimeSpan.FromSeconds(1), cancellationToken);
            }
        }

        public async Task<FullUserDTO> loginUser(LoginUserDTO loginUserDTO)
        {
            var users = await this.StateManager.GetOrAddAsync<IReliableDictionary<string, User>>("UserEntities");
            using (var tx = this.StateManager.CreateTransaction())
            {
                ConditionalValue<User> result = await users.TryGetValueAsync(tx, loginUserDTO.Email);
                if (result.HasValue && result.Value.Email == loginUserDTO.Email && result.Value.Password == loginUserDTO.Password)
                {
                   return new FullUserDTO(result.Value.Address,result.Value.AverageRating,result.Value.SumOfRatings,result.Value.NumOfRatings,result.Value.Birthday,result.Value.Email,result.Value.IsVerified,result.Value.IsBlocked,result.Value.FirstName,result.Value.LastName,result.Value.Username,result.Value.TypeOfUser,result.Value.ImageFile);
                }
                else return new FullUserDTO();

            }
        }

        public async Task<List<FullUserDTO>> listUsers()
        {
            var users = await this.StateManager.GetOrAddAsync<IReliableDictionary<string, User>>("UserEntities");

            List<FullUserDTO> userList = new List<FullUserDTO>();

            using (var tx = this.StateManager.CreateTransaction())
            {
                var enumerable = await users.CreateEnumerableAsync(tx);

                using (var enumerator = enumerable.GetAsyncEnumerator())
                {
                    while (await enumerator.MoveNextAsync(default(CancellationToken)))
                    {
                        userList.Add(UserMapper.MapUserToFullUserDto(enumerator.Current.Value));
                    }
                }
            }

            return userList;


        }
    }
}
