import axios from "axios";
import qs from 'qs';

export async function getEstimation(jwt, apiEndpoint, currentLocation,Destination) {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${jwt}`,
                'Content-Type': 'application/json'
            }
        };
        const queryParams = qs.stringify({ Destination: Destination,CurrentLocation:currentLocation });

        const url = `${apiEndpoint}?${queryParams}`;
        const response = await axios.get(url, config);
        return response.data;
    } catch (error) {
        console.error('Error fetching data (async/await):', error.message);
        throw error;
    }
}