import axios from "axios";

export function makeImage(imageFile){
    if (imageFile.fileContent) {
                    const byteCharacters = atob(imageFile.fileContent);
                    const byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);
                    const blob = new Blob([byteArray], { type: imageFile.contentType });
                    const url = URL.createObjectURL(blob);
                    return url;
                }
}
export function convertDateTimeToDateOnly(dateTime){
    const dateObj = new Date(dateTime);

    // Get the date components
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth(); 
    const day = dateObj.getDate();

    // Format the date as 'DD-MM-YYYY'
    return `${day.toString().padStart(2, '0')}-${(month + 1).toString().padStart(2, '0')}-${year}`;
}


export async function changeUserFields(apiEndpoint, firstName, lastName, birthday, address, email, password, imageUrl, username, previousEmail, jwt) {
    const formData = new FormData();
    formData.append('FirstName', firstName);
    formData.append('LastName', lastName);
    formData.append('Birthday', birthday);
    formData.append('Address', address);
    formData.append('Email', email);
    formData.append('Password', password);
    //formData.append('ImageUrl', imageUrl);
    formData.append('Username', username);
    formData.append('PreviousEmail', previousEmail);
    console.log(jwt);
    try {
        const response = await axios.put(apiEndpoint, formData, {
            headers: {
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log("Change of user successfully happened!", response);
    } catch (error) {
        console.error('Error while calling API to change user fields:', error);
    }
}