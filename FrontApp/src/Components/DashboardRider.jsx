import React, { useState, useEffect } from 'react';
import { MdPerson } from 'react-icons/md';
import { FaCar } from 'react-icons/fa';
import { FaRoad } from 'react-icons/fa';
import { FaSignOutAlt } from 'react-icons/fa';
import { MdConfirmationNumber } from 'react-icons/md';
import { useNavigate } from "react-router-dom";
import { makeImage, convertDateTimeToDateOnly, changeUserFields } from '../Services/ProfileService';
import { getUserInfo } from '../Services/ProfileService';
import '../Style/NewDrive.css';
import { getEstimation, AcceptDrive, convertTimeStringToMinutes } from '../Services/Estimation.js';
import {getCurrentRide} from '../Services/RiderService.js';
import {getCurrentTrip} from '../Services/RiderService.js';
export default function RiderDashboard(props) {
    const user = props.user;

    const jwt = localStorage.getItem('token');
    const navigate = useNavigate();
    const apiEndpoint = process.env.REACT_APP_CHANGE_USER_FIELDS;
    const apiForCurrentUserInfo = process.env.REACT_APP_GET_USER_INFO;


    const apiEndpointEstimation = process.env.REACT_APP_GET_ESTIMATION_PRICE;
    const apiEndpointAcceptDrive = process.env.REACT_APP_ACCEPT_SUGGESTED_DRIVE;
    const apiEpointGetCurrentDrive= process.env.REACT_APP_GET_ACTIVE_TRIP;
    const apiEndpointCurrentTrip = process.env.REACT_APP_CURRENT_TRIP;

    const [destination, setDestination] = useState(''); // destination 
    const [currentLocation, setCurrentLocation] = useState(''); // current location
    const [estimation, setEstimation] = useState(''); // price of drive 
    const [isAccepted, setIsAccepted] = useState(false);
    const [estimatedTime, setEstimatedTime] = useState('');
    const [driversArivalSeconds, setDriversArivalSeconds] = useState('');
    const [tripTicketSubmited, setTripTicketSubmited] = useState(false);
    const userId = user.id; // user id 
    {/*This is data for drive */ }

    const [activeDestination,setActiveDestination] = useState('');
    const [activeLocation,setActiveLocation] = useState('');
    const [activePrice,setActivePrice]= useState('');
    const [activeIsAccepted,setActiveIsAccepted] = useState(false);
    const [activeMinutesToArrive,setActiveMinutesToArrive] = useState('');
    const [activeMinutesToEndTrip,setActiveMinutesToEndTrip] = useState('');
    const [activeTripId,setActiveTripId] = useState('');
 




    const handleEstimationSubmit = async () => {
        try {
            if (destination == '' || currentLocation == '') alert("Please complete form!");
            else {
                const data = await getEstimation(localStorage.getItem('token'), apiEndpointEstimation, currentLocation, destination);
                console.log("This is estimated price and time:", data);

                const roundedPrice = parseFloat(data.price.estimatedPrice).toFixed(2);
                console.log(typeof driversArivalSeconds);
                setDriversArivalSeconds(convertTimeStringToMinutes(data.price.driversArivalSeconds));
                setEstimation(roundedPrice);

            }

        } catch (error) {
            console.error("Error when I try to show profile", error);
        }
    };

    const handleAcceptDriveSubmit = async () => {
        try {
            const data = await AcceptDrive(apiEndpointAcceptDrive, userId, jwt, currentLocation, destination, estimation, isAccepted, driversArivalSeconds);

            setActiveTripId(data.drive.tripId);
            setActiveDestination(data.drive.destination);
            setActiveLocation(data.drive.currentLocation);
            setActiveMinutesToArrive(data.drive.minutesToDriverArrive);
            setActiveMinutesToEndTrip(data.drive.minutesToEndTrip);
            setActivePrice(data.drive.price);
            setActiveIsAccepted(data.drive.accepted);     
            setView('currentTicket');
            if (data.message && data.message == "Request failed with status code 400") {
                alert("You have already submited tiket!");
                setView('currentTicket');
            }
            console.log("Result from creating new drive", data);
        } catch (error) {
            console.error("Error when I try to show profile", error);
        }
    };


    const handleLocationChange = (event) => {
        setCurrentLocation(event.target.value);
    };

    const handleDestinationChange = (event) => {
        setDestination(event.target.value);
    };




    const [currentUser, setUserInfo] = useState('');

    const [address, setAddress] = useState('');
    const [averageRating, setAverageRating] = useState('');
    const [birthday, setBirthday] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState();
    const [imageFile, setImageFile] = useState('');
    const [isBlocked, setIsBlocked] = useState('');
    const [isVerified, setIsVerified] = useState('');
    const [lastName, setLastName] = useState('');
    const [numOfRatings, setNumOfRatings] = useState('');
    const [password, setPassword] = useState('');
    const [roles, setRoles] = useState('');
    const [status, setStatus] = useState('');
    const [sumOfRatings, setSumOfRatings] = useState('');
    const [username, setUsername] = useState('');

    const [view, setView] = useState('editProfile');
    console.log(view);
    const [isEditing, setIsEditing] = useState(false);

    //pw repeat
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [repeatNewPassword, setRepeatNewPassword] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const [initialUser, setInitialUser] = useState({});


    const handleSignOut = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleSaveClick = async () => {
        const ChangedUser = await changeUserFields(apiEndpoint, firstName, lastName, birthday, address, email, password, selectedFile, username, jwt, newPassword, repeatNewPassword, oldPassword, userId);
        console.log("Changed user:", ChangedUser);

        setInitialUser(ChangedUser);
        setUserInfo(ChangedUser);
        setAddress(ChangedUser.address);
        setAverageRating(ChangedUser.averageRating);
        setBirthday(convertDateTimeToDateOnly(ChangedUser.birthday));
        setEmail(ChangedUser.email);
        setFirstName(ChangedUser.firstName);
        setImageFile(makeImage(ChangedUser.imageFile));
        setIsBlocked(ChangedUser.isBlocked);
        setIsVerified(ChangedUser.isVerified);
        setLastName(ChangedUser.lastName);
        setNumOfRatings(ChangedUser.numOfRatings);
        setPassword(ChangedUser.password);
        setRoles(ChangedUser.roles);
        setStatus(ChangedUser.status);
        setSumOfRatings(ChangedUser.sumOfRatings);
        setUsername(ChangedUser.username);

        setIsEditing(false);
    }




    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleNewDriveClick = () => {
        setView('newDrive');
        
    }

    const handleEditProfile = () => {
        setView('editProfile');
    }

    const handleGetActiveTrip = async () => {
        try {

                const data = await getCurrentRide(jwt,apiEpointGetCurrentDrive,userId); 
                return data;
        } catch (error) {
            console.error("Error when I try to show profile", error);
        }
    };
    const handleCurrentTicket = async () => {
        try {
            setView('currentTicket');
            
        } catch (error) {
            console.error('Error fetching trip data:', error);
            // Handle the error (e.g., show an error message to the user)
        }
    };
    
    //trip koji treba da se usefetchuje 


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImageFile(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setAddress(initialUser.address);
        setAverageRating(initialUser.averageRating);
        setBirthday(convertDateTimeToDateOnly(initialUser.birthday));
        setEmail(initialUser.email);
        setFirstName(initialUser.firstName);
        setImageFile(makeImage(initialUser.imageFile));
        setIsBlocked(initialUser.isBlocked);
        setIsVerified(initialUser.isVerified);
        setLastName(initialUser.lastName);
        setNumOfRatings(initialUser.numOfRatings);
        setPassword(initialUser.password);
        setRoles(initialUser.roles);
        setStatus(initialUser.status);
        setSumOfRatings(initialUser.sumOfRatings);
        setUsername(initialUser.username);
        setOldPassword('');
        setNewPassword('');
        setRepeatNewPassword('');
        setSelectedFile(null);
    };

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userInfo = await getUserInfo(jwt, apiForCurrentUserInfo, userId);
                handleCurrentTicket();
                const user = userInfo.user;
                setUserInfo(user); // Update state with fetched user info
                setInitialUser(user); // Set initial user info

                setAddress(user.address);
                setAverageRating(user.averageRating);
                setBirthday(convertDateTimeToDateOnly(user.birthday));
                setEmail(user.email);
                setFirstName(user.firstName);
                setImageFile(makeImage(user.imageFile));
                setIsBlocked(user.isBlocked);
                setIsVerified(user.isVerified);
                setLastName(user.lastName);
                setNumOfRatings(user.numOfRatings);
                setPassword(user.password);
                setRoles(user.roles);
                setStatus(user.status);
                setSumOfRatings(user.sumOfRatings);
                setUsername(user.username);
            } catch (error) {
                console.error('Error fetching user info:', error.message);
            }
        };

        fetchUserInfo();
    }, [jwt, apiForCurrentUserInfo, userId]);



    useEffect(() => {
        const fetchData = async () => {
          try {
            const data = await getCurrentTrip(jwt,apiEndpointCurrentTrip,userId);
            console.log("This is data from current accepted trip",data);
            if(data && data.trip.accepted){
                console.log("Krece odbrojavanje");
            }

          } catch (error) {
            console.error("Error fetching active trip data:", error);
          }
        };

        fetchData();
      }, [view]);

    console.log(activeDestination);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <div className="black-headerDashboar flex justify-between items-center p-4">
                <button className="button-logout" onClick={handleSignOut}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <FaSignOutAlt size={25} style={{ marginRight: '4px' }} />
                        <span>Sign out</span>
                    </div>
                </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', flex: 1, justifyContent: 'flex-start' }}>
                <div style={{ width: '20%', height: '100%', backgroundColor: 'black', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', columnGap: '10px' }}>
                    <div>
                        <p style={{ color: "white", textAlign: "left", fontSize: "20px" }}>Hi, {username}</p>
                    </div>
                    <div>
                        <hr style={{ width: '330px' }} />
                    </div>
                    <button className="button" onClick={handleEditProfile}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <MdPerson size={25} style={{ marginRight: '30px' }} />
                            <span>Profile</span>
                        </div>
                    </button>
                    <button className="button" onClick={handleNewDriveClick}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <FaCar size={25} style={{ marginRight: '30px' }} />
                            <span>New drive</span>
                        </div>
                    </button>
                    <button className="button">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <FaRoad size={25} style={{ marginRight: '30px' }} />
                            <span>Driving history</span>
                        </div>
                    </button>
                    <button className="button" onClick={handleCurrentTicket}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <MdConfirmationNumber size={25} style={{ marginRight: '30px' }} />
                            <span>Current ticket</span>
                        </div>
                    </button>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ height: '100%', display: 'flex' }}>
                        {view === "editProfile" ? (
                            <div style={{ width: '100%', backgroundColor: 'white' }}>
                                <div>
                                    <div className="custom-style">Edit profile</div>
                                    <div>
                                        <img src={imageFile} alt="User" style={{ width: '100px', height: '100px', marginLeft: '30px', marginTop: '20px', borderRadius: '50%' }} />
                                    </div>
                                    {isEditing ? (
                                        <div className='customView-div' style={{ marginLeft: '30px', marginTop: '20px' }}>
                                            <input type='file' onChange={handleImageChange} />
                                        </div>
                                    ) : (
                                        <div className='customView-div'></div>
                                    )}
                                    <div style={{ marginLeft: '30px', marginTop: '20px' }}>
                                        <div className='customProfile-div'>Username</div>
                                        {isEditing ? (
                                            <input className='customView-div' type='text' value={username} onChange={(e) => setUsername(e.target.value)} />
                                        ) : (
                                            <div className='customView-div'>{username}</div>
                                        )}
                                        <hr className='customProfile-hr' />
                                        <div className='customProfile-div'>First name</div>
                                        {isEditing ? (
                                            <input className='customView-div' type='text' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                        ) : (
                                            <div className='customView-div'>{firstName}</div>
                                        )}
                                        <hr className='customProfile-hr' />
                                        <div className='customProfile-div'>Last name</div>
                                        {isEditing ? (
                                            <input className='customView-div' type='text' value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                        ) : (
                                            <div className='customView-div'>{lastName}</div>
                                        )}
                                        <hr className='customProfile-hr' />
                                        <div className='customProfile-div'>Address</div>
                                        {isEditing ? (
                                            <input className='customView-div' type='text' value={address} onChange={(e) => setAddress(e.target.value)} />
                                        ) : (
                                            <div className='customView-div'>{address}</div>
                                        )}
                                        <hr className='customProfile-hr' />
                                        <div className='customProfile-div'>Birthday</div>
                                        {isEditing ? (
                                            <input className='customView-div' type='text' value={birthday} onChange={(e) => setBirthday(e.target.value)} />
                                        ) : (
                                            <div className='customView-div'>{birthday}</div>
                                        )}
                                        <hr className='customProfile-hr' />
                                        <div className='customProfile-div'>Email</div>
                                        {isEditing ? (
                                            <input className='customView-div' type='email' value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '250px' }} />
                                        ) : (
                                            <div className='customView-div'>{email}</div>
                                        )}
                                        <hr className='customProfile-hr' />
                                        <div className='customProfile-div'>Old password</div>
                                        {isEditing ? (
                                            <input className='customView-div' type='password' value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                                        ) : (
                                            <div className='customView-div'>
                                                <input className='customView-div' type='password' placeholder='********' disabled />
                                            </div>
                                        )}
                                        <hr className='customProfile-hr' />
                                        <div className='customProfile-div'>New password</div>
                                        {isEditing ? (
                                            <input className='customView-div' type='password' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                        ) : (
                                            <div className='customView-div'>
                                                <input className='customView-div' type='password' placeholder='********' disabled />
                                            </div>
                                        )}
                                        <hr className='customProfile-hr' />
                                        <div className='customProfile-div'>Repeat new password</div>
                                        {isEditing ? (
                                            <input className='customView-div' type='password' value={repeatNewPassword} onChange={(e) => setRepeatNewPassword(e.target.value)} />
                                        ) : (
                                            <div className='customView-div'>
                                                <input className='customView-div' type='password' placeholder='********' disabled />
                                            </div>
                                        )}
                                        <hr className='customProfile-hr' />
                                        <br />
                                        {isEditing ? (
                                            <div>
                                                <button className='edit-button' onClick={handleSaveClick}>Save</button>
                                                <button className='edit-button' onClick={handleCancelClick}>Cancel</button>
                                            </div>
                                        ) : (
                                            <div>
                                                <button className='edit-button' onClick={handleEditClick}>Edit</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : view == 'newDrive' ? (


                            <div style={{
                                width: '100%',
                                height: '100vh',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'white'
                            }}>
                                <div className="centered" style={{
                                    width: '30%',
                                    height: '60%',
                                    margin: '50px',
                                    padding: '20px',
                                    backgroundColor: 'black',
                                    borderRadius: '10px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    color: 'white'
                                }}>
                                    <div style={{
                                        fontSize: '40px',
                                        textAlign: 'left',

                                    }}>
                                        Go anywhere with
                                    </div>
                                    <div style={{
                                        fontSize: '40px',
                                        textAlign: 'left',
                                        marginBottom: '20px',
                                        marginRight: '235px'
                                    }}>
                                        Taxi
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Enter location"
                                        style={{
                                            width: '80%',
                                            margin: '10px 0',
                                            padding: '10px',
                                            borderRadius: '5px',
                                            border: 'none',
                                            backgroundColor: 'black',
                                            boxShadow: '0 0 0 1px white inset'
                                        }}
                                        onChange={handleLocationChange}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Enter destination"
                                        style={{
                                            width: '80%',
                                            margin: '10px 0',
                                            padding: '10px',
                                            borderRadius: '5px',
                                            border: 'none',
                                            backgroundColor: 'black',
                                            boxShadow: '0 0 0 1px white inset'
                                        }}
                                        onChange={handleDestinationChange}
                                    />
                                    <button
                                        style={{
                                            width: '80%',
                                            margin: '10px 0',
                                            padding: '10px',
                                            borderRadius: '5px',
                                            border: 'none',
                                            backgroundColor: 'white',
                                            color: 'black',
                                            cursor: 'pointer'
                                        }}
                                        onClick={handleEstimationSubmit}
                                    >
                                        See Price
                                    </button>
                                    <input
                                        type="text"
                                        value={`Estimated price is: ${estimation}\u20AC`}
                                        style={{
                                            width: '80%',
                                            margin: '10px 0',
                                            padding: '10px',
                                            borderRadius: '5px',
                                            border: 'none',
                                            backgroundColor: 'black',
                                            boxShadow: '0 0 0 1px white inset'
                                        }}
                                    />
                                    <input
                                        type="text"
                                        value={`Estimated time of waiting: ${driversArivalSeconds} minute`}
                                        style={{
                                            width: '80%',
                                            margin: '10px 0',
                                            padding: '10px',
                                            borderRadius: '5px',
                                            border: 'none',
                                            backgroundColor: 'black',
                                            boxShadow: '0 0 0 1px white inset'
                                        }}
                                    />
                                    {estimation !== '' && driversArivalSeconds != '' && (
                                        <button
                                            style={{
                                                width: '80%',
                                                margin: '10px 0',
                                                padding: '10px',
                                                borderRadius: '5px',
                                                border: 'none',
                                                backgroundColor: 'white',
                                                color: 'black',
                                                cursor: 'pointer'
                                            }}
                                            onClick={handleAcceptDriveSubmit}
                                        >
                                            Accept
                                        </button>
                                    )}

                                </div>
                            </div>
                        ) : view == "currentTicket" ? (
                 
                            <div className="centered" style={{ width: '100%', height: '10%' }}>
                            <table className="styled-table">
                                <thead>
                                    <tr>
                                        <th>Location</th>
                                        <th>Destination</th>
                                        <th>Price</th>
                                        <th>Driver Arrival</th>
                                        {activeIsAccepted && <th>Minutes To End Trip</th>}
                                        <th>Is Ticket Accepted</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{activeLocation}</td>
                                        <td>{activeDestination}</td>
                                        <td>{activePrice}{'\u20AC'}</td>
                                        <td>{activeMinutesToArrive} minutes</td>
                                        {activeIsAccepted && <td>{activeMinutesToEndTrip}</td>}
                                        <td>{activeIsAccepted ? "Accepted" : "Not Accepted"}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                           ) : <div className="centered" style={{ width: '100%', height: '10%' }}>
                          
                       </div>
                       
                        }
                    </div>
                </div>
            </div>
        </div>
    );

}
