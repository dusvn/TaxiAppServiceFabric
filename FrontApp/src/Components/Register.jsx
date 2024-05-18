import React, { useEffect, useState } from 'react';
import { GoogleLogin } from 'react-google-login';
import '../Style/RegisterPage.css';
import { gapi } from 'gapi-script';
import { Link } from 'react-router-dom';
import { RegularRegisterApiCall } from '../Services/RegisterServices.js';
import {useNavigate} from "react-router-dom";


export default function Register() {
    const clientId = process.env.REACT_APP_CLIENT_ID;
    const regularRegisterApiEndpoint = process.env.REACT_APP_REGULAR_REGISTER_API_URL;

    const [firstName, setFirstName] = useState('');
    const [firstNameError, setFirstNameError] = useState(true);

    const [lastName, setLastName] = useState('');
    const [lastNameError, setLastNameError] = useState(true);

    const [birthday, setBirthday] = useState('');
    const [birthdayError, setBirthdayError] = useState(true);

    const [address, setAddress] = useState('');
    const [addressError, setAddressError] = useState(true);

    const [username, setUsername] = useState('');
    const [usernameError, setUsernameError] = useState(true);


    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(true);

    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState(true);

    const [repeatPassword, setRepeatPassowrd] = useState('');
    const [repeatPasswordError, setRepeatPassowrdError] = useState(true);

    const [typeOfUser, setTypeOfUser] = useState('Driver');
    const [typeOfUserError, setTypeOfUserError] = useState(false);

    const [imageUrl, setImageUrl] = useState(null);


    const [imageUrlError, setImageUrlError] = useState(true);

    const [userGoogleRegister, setUserGoogleRegister] = useState('');
    const [googleRegisterView, setGoogleRegisterView] = useState(true);
    const navigate = useNavigate();

    //console.log(googleRegisterView);
    const handleRegisterClick = (e) => {
        e.preventDefault();

       const resultOfRegister = RegularRegisterApiCall(
            firstNameError,
            lastNameError,
            birthdayError,
            addressError,
            usernameError,
            emailError,
            passwordError,
            repeatPasswordError,
            imageUrlError,
            firstName,
            lastName,
            birthday,
            address,
            email,
            password,
            repeatPassword,
            imageUrl,
            typeOfUser,
            username,
            regularRegisterApiEndpoint
        );
        if(resultOfRegister){
            alert("Succeesfuly register!"); 
            navigate("/");
        }

    };



    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        if (value.trim() === '') {
            setEmailError(true);
        } else if (!isValidEmail) {
            setEmailError(true);
        } else {
            setEmailError(false);
        }
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        const isValidPassword = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/.test(value);
        if (value.trim() === '') {
            setPasswordError(true);
        } else if (!isValidPassword) {
            setPasswordError(true);
        } else if (!value.trim() === passwordError) {
            setPasswordError(true);
        }
        else {
            setPasswordError(false);
        }
    };

    const handlePasswordRepeatChange = (e) => {
        const value = e.target.value;
        setRepeatPassowrd(value);
        const isValidPassword = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/.test(value);
        if (value.trim() === '') {
            setRepeatPassowrdError(true);
        } else if (!isValidPassword) {
            setRepeatPassowrdError(true);
        } else if (!value.trim() === password) {
            setRepeatPassowrdError(true);
        }
        else {
            setRepeatPassowrdError(false);
        }
    };

    const handleFirstNameChange = (e) => {
        const value = e.target.value;
        setFirstName(value);
        if (value.trim() === '') {
            setFirstNameError(true);
        } else {
            setFirstNameError(false);
        }
    };

    const handleAddressChange = (e) => {
        const value = e.target.value;
        setAddress(value);
        if (value.trim() === '') {
            setAddressError(true);
        } else {
            setAddressError(false);
        }
    };

    const handleUsernameChange = (e) => {
        const value = e.target.value;
        setUsername(value);
        if (value.trim() === '') {
            setUsernameError(true);
        } else {
            setUsernameError(false);
        }
    };

    const handleLastNameChange = (e) => {
        const value = e.target.value;
        setLastName(value);
        if (value.trim() === '') {
            setLastNameError(true);
        } else {
            setLastNameError(false);
        }
    };

    function isOlderThan18(dateString) {
        const today = new Date();
        const selectedDate = new Date(dateString);
        let age = today.getFullYear() - selectedDate.getFullYear();
        const monthDiff = today.getMonth() - selectedDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < selectedDate.getDate())) {
            age--;
        }
        return age >= 18;
    }
    const handleBirthdayChange = (e) => {
        const value = e.target.value;
        setBirthday(value);
        if (value.trim() === '') {
            setBirthdayError(true);
        } else {
            var isOldEnough = isOlderThan18(value);
            if (isOldEnough) setBirthdayError(false);
            else setBirthdayError(true);
        }
    };


    const handleTypeOfUserChange = (e) => {
        const value = e.target.value;
        setTypeOfUser(value);
        if (value.trim() === '') {
            setTypeOfUserError(true);
        } else {
            setTypeOfUserError(false);
        }
    };

    const handleImageUrlChange = (e) => {
        const selectedFile = e.target.files[0];

        if (!selectedFile || !selectedFile.name) {
            setImageUrlError(true);
        } else {
            setImageUrl(selectedFile);
            setImageUrlError(false);
        }
    };


    useEffect(() => {
        if (clientId) {
            function start() {
                gapi.client.init({
                    clientId: clientId,
                    scope: ""
                });
            }
            gapi.load('client:auth2', start);
        } else {
            console.error("Client ID is not defined in .env file");
        }
    }, [clientId]); // Include clientId in the dependency array

    const onSuccess = (res) => {
        console.log("Succesfuly register Current user:", res.profileObj);
        setUserGoogleRegister(res.profileObj);
        setGoogleRegisterView(false);
    }

    const onFailure = (res) => {
        console.log("Failed register:", res);
    }

    return (
        <div>
            <div className='black-header'>
                <h1>TAXI</h1>
            </div>
            <div className="register-container">
                <div className="register-form">
                    <h3 className='text-4xl dark:text-white font-serif'>Registration</h3>
                    <hr></hr>
                    <br></br>
                    <div className="flex flex-col md:flex-row w-max">
                        <form onSubmit={handleRegisterClick} enctype="multipart/form-data" method='post'>
                            <table className="w-full">
                                <tbody>
                                    <tr>
                                        <td>
                                            <input
                                                className={`input-field mb-4 w-full md:ml-2`}
                                                style={{ borderColor: firstNameError ? '#EF4444' : '#E5E7EB' }}
                                                type="text"
                                                placeholder="First Name"
                                                value={firstName}
                                                onChange={handleFirstNameChange}
                                                required
                                            />
                                        </td>
                                        <td> <input
                                            className={`input-field mb-4 w-full md:ml-2`}
                                            style={{ borderColor: lastNameError ? '#EF4444' : '#E5E7EB' }}
                                            type="text"
                                            placeholder="Last Name"
                                            value={lastName}
                                            onChange={handleLastNameChange}
                                            required
                                        />

                                        </td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td className='font-serif font-bold'>Date of birth</td>
                                        <td><input
                                            className={`input-field mb-4 w-full md:ml-2`}
                                            style={{ borderColor: birthdayError ? '#EF4444' : '#E5E7EB' }}
                                            type="date"
                                            value={birthday}
                                            onChange={handleBirthdayChange}
                                            required
                                        />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={2}><input
                                            className={`input-field mb-4 w-full md:ml-2`}
                                            style={{ borderColor: addressError ? '#EF4444' : '#E5E7EB' }}
                                            type="text"
                                            placeholder="Address"
                                            value={address}
                                            onChange={handleAddressChange}
                                            required
                                        />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input
                                                className={`input-field mb-4 w-full md:ml-2`}
                                                style={{ borderColor: usernameError ? '#EF4444' : '#E5E7EB' }}
                                                type="text"
                                                placeholder="Username"
                                                value={username}
                                                onChange={handleUsernameChange}
                                                required
                                            />

                                        </td>
                                        <input
                                            className={`input-field mb-4 w-full md:ml-2`}
                                            style={{ borderColor: emailError ? '#EF4444' : '#E5E7EB' }}
                                            type="email"
                                            placeholder="Email"
                                            value={email}
                                            onChange={handleEmailChange}
                                            required
                                        />

                                    </tr>
                                    <tr>
                                        <td>
                                            <input
                                                className={`input-field mb-4 w-full md:ml-2`}
                                                style={{ borderColor: passwordError ? '#EF4444' : '#E5E7EB' }}
                                                type="password"
                                                title='Passoword need 8 character one capital letter,number and special character'
                                                placeholder="Password"
                                                value={password}
                                                onChange={handlePasswordChange}
                                                required
                                            />
                                        </td>

                                        <td>
                                            <input
                                                className={`input-field mb-4 w-full md:ml-2`}
                                                style={{ borderColor: repeatPasswordError ? '#EF4444' : '#E5E7EB' }}
                                                type="password"
                                                title='Passoword need 8 character one capital letter,number and special character'
                                                placeholder="Repeat Password"
                                                value={repeatPassword}
                                                onChange={handlePasswordRepeatChange}
                                                required
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>You are</td>
                                        <td>
                                            <select className={`input-field mb-4 w-full md:ml-2`}
                                                style={{ borderColor: typeOfUserError ? '#EF4444' : '#E5E7EB' }}
                                                value={typeOfUser}
                                                onChange={handleTypeOfUserChange}

                                            >
                                                <option>Driver</option>
                                                <option>Rider</option>
                                                <option>Admin</option>
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Profile image</td>
                                        <td>
                                            <input type='file'
                                                className={`input-field mb-4 w-full md:ml-2`}
                                                style={{ borderColor: imageUrlError ? '#EF4444' : '#E5E7EB' }}
                                                onChange={handleImageUrlChange}
                                                required
                                            ></input>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={2} ><button type='submit'>Register</button></td>
                                    </tr>
                                </tbody>
                            </table>
                        </form>
                        {googleRegisterView && (
                            <>
                                <h2><span>or</span></h2>
                                <div>
                                    <GoogleLogin
                                        clientId={clientId}
                                        buttonText='Continue with Google'
                                        onFailure={onFailure}
                                        onSuccess={onSuccess}
                                        cookiePolicy={'single_host_origin'}
                                        isSignedIn={true}
                                    />
                                </div>
                            </>
                        )}
                        <div>
                            <p className="signup-link">Have an account? &nbsp;
                                {/* <a href="#" className="text-gray-800 font-bold">Sign up</a> */}
                                <Link to="/" className="text-gray-800 font-bold">
                                    Login
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}