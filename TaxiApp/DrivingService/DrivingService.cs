using System;
using System.Collections.Generic;
using System.Fabric;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.ServiceFabric.Data.Collections;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Runtime;
using Microsoft.ServiceFabric.Services.Remoting.Runtime;
using Microsoft.ServiceFabric.Services.Remoting;
using Common.Interfaces;
using Common.Models;
using Common.Mapper;
using Common.Entities;
using Microsoft.WindowsAzure.Storage.Blob;
using Microsoft.WindowsAzure.Storage.Table;
using System.Transactions;
namespace DrivingService
{
    /// <summary>
    /// An instance of this class is created for each service replica by the Service Fabric runtime.
    /// </summary>
    public sealed class DrivingService : StatefulService,IDrive
    {
        DrivingDataRepo dataRepo;
        public DrivingService(StatefulServiceContext context)
            : base(context)
        {
           dataRepo  = new DrivingDataRepo("TaxiAppDriving");
        }

        public async Task<RoadTrip> AcceptRoadTrip(RoadTrip trip)
        {
            var roadTrips = await this.StateManager.GetOrAddAsync<IReliableDictionary<Guid, RoadTrip>>("Trips");
            try
            {
                using (var tx = StateManager.CreateTransaction())
                {
                    if (!await CheckIfTripAlreadyExists(trip))
                    {
                        var enumerable = await roadTrips.CreateEnumerableAsync(tx);

                        using (var enumerator = enumerable.GetAsyncEnumerator())
                        {

                            await roadTrips.AddAsync(tx, trip.TripId,trip);


                            RoadTripEntity entity = new RoadTripEntity(trip.RiderId, trip.DriverId, trip.CurrentLocation, trip.Destination, trip.Accepted, trip.Price, trip.TripId);
                            TableOperation operation = TableOperation.Insert(entity);
                            await dataRepo.Trips.ExecuteAsync(operation);
                            ////insert user in database
                            //UserEntity newUser = new UserEntity(user, imageUrl);
                            //TableOperation operation = TableOperation.Insert(newUser);
                            //await dataRepo.Users.ExecuteAsync(operation);


                            //await transaction.CommitAsync();
                            //return true;
                        }
                    }
                }
                return new RoadTrip();
            }
            catch (Exception)
            {
                throw;
            }
        }

        private async Task<bool> CheckIfTripAlreadyExists(RoadTrip trip)
        {
            var roadTrips = await this.StateManager.GetOrAddAsync<IReliableDictionary<Guid, RoadTrip>>("Trips");
            try
            {
                using (var tx = StateManager.CreateTransaction())
                {
                  
                    var enumerable = await roadTrips.CreateEnumerableAsync(tx);

                    using (var enumerator = enumerable.GetAsyncEnumerator())
                    {
                        while (await enumerator.MoveNextAsync(default(CancellationToken)))
                        {
                            if (enumerator.Current.Value.TripId == trip.TripId)
                            {
                                return true;
                            }
                        }
                    }
                }
                return false;
            }
            catch (Exception)
            {
                throw;
            }
        }

        private async Task LoadRoadTrips()
        {
            var roadTrip = await this.StateManager.GetOrAddAsync<IReliableDictionary<Guid, RoadTrip>>("Trips");
        
            try
            {
                using (var transaction = StateManager.CreateTransaction())
                {
                    var trips = dataRepo.GetAllTrips();
                    if (trips.Count() == 0) return;
                    else
                    {
                        foreach (var trip in trips)
                        {
                            await roadTrip.AddAsync(transaction, trip.TripId, RoadTripMapper.MapRoadTripEntityToRoadTrip(trip)); // svakako cu se iterirati kroz svaki move next async 
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
            var roadTrip = await this.StateManager.GetOrAddAsync<IReliableDictionary<Guid, RoadTrip>>("Trips");
            await LoadRoadTrips();
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
    }
}
