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