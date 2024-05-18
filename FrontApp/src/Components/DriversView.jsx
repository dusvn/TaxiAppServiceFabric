import React, { useState, useEffect } from 'react';
import '../Style/DriversView.css'; // Import your CSS file for styling
import { ChangeDriverStatus, GetAllDrivers } from '../Services/AdminService.js';

export default function DriversView(props) {
    const [drivers, setDrivers] = useState([]);
    const token = localStorage.getItem('token');
    const apiEndpoint = process.env.REACT_APP_CHANGE_DRIVER_STATUS;
    const getAllDriversEndpoint = process.env.REACT_APP_GET_ALL_DRIVERS;

    // Function to fetch all drivers
    const fetchDrivers = async () => {
        try {
            const data = await GetAllDrivers(getAllDriversEndpoint, token);
            setDrivers(data.drivers);
        } catch (error) {
            console.error('Error fetching drivers:', error);
        }
    };

    useEffect(() => {
        fetchDrivers();
    }, []);

    const handleChangeStatus = async (email, isBlocked) => {
        try {
            await ChangeDriverStatus(apiEndpoint, email, !isBlocked, token); // Toggle the isBlocked value
            await fetchDrivers(); // Refresh the list of drivers
        } catch (error) {
            console.error('Error changing driver status:', error);
        }
    };

    return (
        <div className="centered">
            <table className="styled-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Username</th>
                        <th>Average rating</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {drivers.map((val, key) => (
                        <tr key={val.email}>
                            <td>{val.name}</td>
                            <td>{val.lastName}</td>
                            <td>{val.email}</td>
                            <td>{val.username}</td>
                            <td>{val.averageRating}</td>
                            <td>
                                {val.isBlocked ? (
                                    <button className="green-button" onClick={() => handleChangeStatus(val.email, val.isBlocked)}>Unblock</button>
                                ) : (
                                    <button className="red-button" onClick={() => handleChangeStatus(val.email, val.isBlocked)}>Block</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
