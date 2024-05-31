import axios from "axios";
import qs from 'qs';

export async function getCurrentRide(jwt, apiEndpoint,userId) {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${jwt}`,
                'Content-Type': 'application/json'
            }
        };
        console.log(apiEndpoint);
        const queryParams = qs.stringify({ id: userId });

        const url = `${apiEndpoint}?${queryParams}`;
        const response = await axios.get(url, config);
        return response.data;
    } catch (error) {
        //console.error('Error fetching data (async/await):', error.message);
        //throw error;
        return { error: error.response };
    }
}

