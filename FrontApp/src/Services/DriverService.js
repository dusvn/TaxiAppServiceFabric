import axios from "axios";
import qs from 'qs';

export  async function getAllAvailableRides(jwt, apiEndpoint) {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${jwt}`,
                'Content-Type': 'application/json'
            }
        };
        const url = `${apiEndpoint}`;
        const response = await axios.get(url, config);
        return response.data;
    } catch (error) {
        console.error('Error fetching data (async/await):', error.message);
        throw error;
    }
}


export  async function AcceptDrive(apiEndpoint, driverId,idRide,jwt) {
    try {
        
        const response = await axios.put(apiEndpoint, {
            DriverId :driverId,
            RideId :idRide
        }, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error while calling api for login user:', error);
        return error;
    }
}

export  async function FinishRide(apiEndpoint, tripId,jwt) {
    try {
        const response = await axios.put(apiEndpoint, {
            tripId : tripId,
        }, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error while calling api for login user:', error);
        return error;
    }
}