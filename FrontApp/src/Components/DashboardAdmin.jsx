import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../Style/Dashboard.css'; // Ensure this path matches your project structure
import { MdPerson } from 'react-icons/md';
import { FaCheckCircle } from 'react-icons/fa';
import { FaCar } from 'react-icons/fa';
import { FaRoad } from 'react-icons/fa';
import { FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import EditProfile from './EditProfile.jsx';
import { GetAllDrivers } from '../Services/AdminService.js';
import  DriversView  from './DriversView.jsx';

export default function DashboardAdmin() {
    const location = useLocation();
    const user = location.state?.user;
    const [userName, setUserName] = useState(user.username);
    const [driversView,setDriversView] = useState('');
    const [view, setView] = useState('editProfile');


    const getAllDriversEndpoint = process.env.REACT_APP_GET_ALL_DRIVERS;
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    console.log(localStorage.getItem('token'));
    const handleSignOut = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleShowDrivers = async () => {
        try {
            setView('drivers');
        } catch (error) {
            console.error('Error fetching drivers:', error.message);
        }
    };

    const handleEditProfile = async () =>{
        try{
            setView('editProfile');
        }catch(error){
            console.log("Error when I try to show profile");
        }
    }

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
                        <p style={{ color: "white", textAlign: "left", fontSize: "20px" }}>Hi,{userName}</p>
                    </div>
                    <div>
                        <hr style={{ width: '330px' }}></hr>
                    </div>
                    <button className="button" onClick={handleEditProfile}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <MdPerson size={25} style={{ marginRight: '30px' }} />
                            <span>Profile</span>
                        </div>
                    </button>
                    <button className="button">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <FaCheckCircle size={25} style={{ marginRight: '30px' }} />
                            <span>Verify drivers</span>
                        </div>
                    </button>
                    <button className="button" onClick={handleShowDrivers}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <FaCar size={25} style={{ marginRight: '30px' }} />
                            <span>Drivers</span>
                        </div>
                    </button>
                    <button className="button">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <FaRoad size={25} style={{ marginRight: '30px' }} />
                            <span>Rides</span>
                        </div>
                    </button>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ height: '100%', display: 'flex' }}>
                        <div style={{ width: '100%', backgroundColor: 'white' }}>
                            {view === 'editProfile' ? <EditProfile user={user} /> : <DriversView/>}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
