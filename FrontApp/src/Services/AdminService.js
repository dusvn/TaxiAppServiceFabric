import axios from 'axios';

export async function GetAllDrivers(apiEndpoint, jwtToken) {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${jwtToken}`, // Include the JWT token
            }
        };

        return axios.get(apiEndpoint, config)
        .then(response => response.data);
        
    } catch (error) {
        console.error('Error fetching data (async/await):', error.message);
        throw error; // rethrow the error to handle it in the component
    }
}

export async function ChangeDriverStatus(apiEndpoint, email, changeStatus, jwt) {
    try {
        const response = await axios.put(apiEndpoint, {
            email: email,
            status: changeStatus
        }, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });
        console.log("Change of driver status sucesfully hapaned!",response);
    } catch (error) {
        console.error('Error while calling api for login user:', error);
    }
}

