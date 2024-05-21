import React, { useState, useEffect } from 'react';
import '../Style/NewDrive.css';
import { getEstimation } from '../Services/Estimation.js';

export default function NewDrive() {
    const apiEndpoint = process.env.REACT_APP_GET_ESTIMATION_PRICE;

    const [destination, setDestination] = useState('');
    const [currentLocation, setCurrentLocation] = useState('');
    const [estimation, setEstimation] = useState('');

    const handleEstimationSubmit = async () => {
        try {
            if(destination=='' || currentLocation=='') alert("Please complete form!");
            else{
            const data = await getEstimation(localStorage.getItem('token'), apiEndpoint, currentLocation, destination);
            const roundedPrice = parseFloat(data.price).toFixed(2);
            setEstimation(roundedPrice);
            }

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
    return (
       <div></div>
    );
}
