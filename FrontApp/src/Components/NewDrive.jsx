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
                {estimation !== '' && (
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
                    >
                        Accept
                    </button>
                )}

            </div>
        </div>
    );
}
