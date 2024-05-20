import React, { useState, useEffect } from 'react';

export default function DriversView() {
    const [drivers, setDrivers] = useState([]);
    const token = localStorage.getItem('token');
    const apiEndpoint = process.env.REACT_APP_CHANGE_DRIVER_STATUS;
    const getAllDriversEndpoint = process.env.REACT_APP_GET_ALL_DRIVERS;

    // Function to fetch all drivers
    const fetchDrivers = async () => {
        try {
            const data = await GetAllDrivers(getAllDriversEndpoint, token);
            console.log("Drivers:",data);
            setDrivers(data.drivers);
        } catch (error) {
            console.error('Error fetching drivers:', error);
        }
    };

    useEffect(() => {
        fetchDrivers();
    }, []);

    const handleChangeStatus = async (id, isBlocked) => {
        try {
            await ChangeDriverStatus(apiEndpoint, id, !isBlocked, token); // Toggle the isBlocked value
            await fetchDrivers(); // Refresh the list of drivers
        } catch (error) {
            console.error('Error changing driver status:', error);
        }
    };

    return (
        <div>
          
        </div>
    );
}
