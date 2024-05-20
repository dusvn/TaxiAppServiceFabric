﻿using Microsoft.Azure;
using Microsoft.WindowsAzure.Storage.Table;
using Microsoft.WindowsAzure.Storage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.WindowsAzure.Storage.Blob;
using Common.Entities;
using static System.Net.Mime.MediaTypeNames;
using Common.Models;
using System.Collections;
using Common.Interfaces;

namespace DrivingService
{
    public class DrivingDataRepo
    {
        private CloudStorageAccount cloudAcc;

        private CloudTableClient tableClient;
        private CloudTable _trips;

        public DrivingDataRepo(string tableName)
        {
            try
            {

                string dataConnectionString = Environment.GetEnvironmentVariable("DataConnectionString");
                CloudAcc = CloudStorageAccount.Parse(dataConnectionString); // create cloud client for making blob,table or queue 


                TableClient = CloudAcc.CreateCloudTableClient(); // table client

                Trips = TableClient.GetTableReference(tableName); // create if not exists Users table 
                Trips.CreateIfNotExistsAsync().Wait();

            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public CloudStorageAccount CloudAcc { get => cloudAcc; set => cloudAcc = value; }
        public CloudTableClient TableClient { get => tableClient; set => tableClient = value; }
        public CloudTable Trips { get => _trips; set => _trips = value; }

        public IEnumerable<RoadTripEntity> GetAllTrips()
        {
            var q = new TableQuery<RoadTripEntity>();
            var qRes = Trips.ExecuteQuerySegmentedAsync(q, null).GetAwaiter().GetResult();
            return qRes.Results;
        }
    }
}