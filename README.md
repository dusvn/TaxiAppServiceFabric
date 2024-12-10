# 🚗 **System Functions**  

## **User Types**  
- **Admin**  
- **Driver**  
- **User**  

---

## **Account Management**  
- **Register**  
  - **Supported for**: User, Driver  
  - Users can create a new account in the system.  
  - **Admin** is pre-inserted into the database.  

- **Register using Google Account**  
  - **Supported for**: User, Driver  

- **Login**  
  - **Supported for**: All users (Admin, Driver, User)  
  - Existing users can log in using their credentials.  
  - Authentication is supported using **JWT Token**.  

- **Change Profile**  
  - **Supported for**: All users (Admin, Driver, User)  
  - Users can update their profile information.  

---

## **Driver Management**  
- **Accept New Drivers**  
  - **Supported for**: Admin  
  - Admin can approve driver requests for work.  
  - Once approved, the driver can start taking new trips.  
  - The driver receives an email notification upon approval.  

- **Block Driver**  
  - **Supported for**: Admin  
  - Admin can view driver ratings and block a driver if necessary.  

---

## **Trip Management**  
- **New Ride**  
  - **Supported for**: User, Driver  
  - Users can request a new ride.  
  - Once a driver accepts the ride, the trip begins.  

- **Trip Simulation**  
  - **Trigger**: When a driver accepts a new trip.  
  - **Driver and User Restrictions**:  
    - During the trip, all other system functions are **blocked** for the driver and user.  
    - The only visible information for the **user** is:  
      - **Time until the driver arrives**.  
      - **Time remaining to complete the trip**.  
    - The only visible information for the **driver** is:  
      - **Time to reach the user’s location**.  
      - **Time to complete the trip**.  

- **Price Estimation**  
  - **Supported for**: User  
  - Users enter their current location and destination.  
  - The system provides an estimate of the trip cost and the driver's arrival time.  

- **Trip Status**  
  - **Supported for**: Admin  
  - Admin can view the status of all trips in the system.  
  - Trip statuses include:  
    - **FINISHED**  
    - **IN PROGRESS**  
    - **WAITING FOR DRIVER**  

---

## **History and Reviews**  
- **Driving History**  
  - **Supported for**: User, Driver  
  - Users and drivers can view the history of their completed trips.  

- **Full Driving History**  
  - **Supported for**: Admin  
  - Admin can view the entire driving history for all users and drivers in the system.  

- **Rating for Drivers**  
  - **Supported for**: User  
  - After completing a trip, users can rate the driver on a scale of 1 to 5 stars.  

## **2. System Architecture**  
![System Architecture](https://github.com/dusvn/TaxiAppServiceFabric/blob/main/TaxiApp.drawio.svg)  
