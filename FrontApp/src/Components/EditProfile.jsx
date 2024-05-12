import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../Style/Profile.css';
import { makeImage, convertDateTimeToDateOnly } from '../Services/ProfileService';

export default function EditProfile(props) {
    const user = props;

    const [isEditing, setIsEditing] = useState(false);
    const [userName, setUserName] = useState(user["user"].username);
    const [address, setAddress] = useState(user["user"].address);
    const [birthday, setBirthday] = useState(convertDateTimeToDateOnly(user["user"].birthday));
    const [email, setEmail] = useState(user["user"].email);
    const [firstName, setFirstName] = useState(user["user"].firstName);
    const [image, setImage] = useState(makeImage(user["user"].imageFile));
    const [lastName, setLastName] = useState(user["user"].lastName);
    const [averageRating, setAverageRating] = useState(user["user"].averageRating);
    const [isVerified, setIsVerified] = useState(user["user"].isVerified);
    const [isBlocked, setIsBlocked] = useState(user["user"].isBlocked);
    const [role, setRole] = useState(user["user"].role);
    const [sumOfRatings, setSumOfRatings] = useState(user["user"].sumOfRatings);
    const [numOfRatings, setNumOfRatings] = useState(user["user"].numOfRatings);
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassowrd] = useState('');
    const [oldPassword,setOldPassword] = useState('');

    console.log(birthday);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        // Perform save logic here
        setIsEditing(false);
    };

    return (
        <div>
            <div className="custom-style">
                Edit profile
            </div>
            <div>
                <img src={image} alt="User" style={{ width: '96px', height: '96px', marginLeft: '30px', marginTop: '20px', borderRadius: '50%' }} />
            </div>
            {isEditing ? (
                <div className='customView-div' style={{marginLeft: '30px',marginTop: '20px'}}>
                    <input type='file'  />
                </div>
            ) : (
                <div className='customView-div'></div>
            )}


            <div style={{ marginLeft: '30px', marginTop: '20px' }}>
                <div className='customProfile-div'>Username</div>
                {isEditing ? (
                    <input className='customView-div' type='text' value={userName} onChange={(e) => setUserName(e.target.value)} />
                ) : (
                    <div className='customView-div'>{userName}</div>
                )}
                <hr className='customProfile-hr'></hr>

                {/* Repeat the pattern for other fields */}
                {/* For example: */}
                <div className='customProfile-div'>First name</div>
                {isEditing ? (
                    <input className='customView-div' type='text' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                ) : (
                    <div className='customView-div'>{firstName}</div>
                )}
                <hr className='customProfile-hr'></hr>

                <div className='customProfile-div'>Last name</div>
                {isEditing ? (
                    <input className='customView-div' type='text' value={lastName} onChange={(e) => setLastName(e.target.value)} />
                ) : (
                    <div className='customView-div'>{lastName}</div>
                )}
                <hr className='customProfile-hr'></hr>

                <div className='customProfile-div'>Address</div>
                {isEditing ? (
                    <input className='customView-div' type='text' value={address} onChange={(e) => setAddress(e.target.value)} />
                ) : (
                    <div className='customView-div'>{address}</div>
                )}
                <hr className='customProfile-hr'></hr>

                <div className='customProfile-div'>Birthday</div>
                {isEditing ? (
                    <input className='customView-div' type='text' value={birthday} onChange={(e) => setBirthday(e.target.value)} />
                ) : (
                    <div className='customView-div'>{birthday}</div>
                )}
                <hr className='customProfile-hr'></hr>

                <div className='customProfile-div'>Email</div>
                {isEditing ? (
                    <input className='customView-div' type='text' value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '250px' }} />
                ) : (
                    <div className='customView-div'>{email}</div>
                )}
                <hr className='customProfile-hr'></hr>
                <div className='customProfile-div'>Old password</div>
                {isEditing ? (
                    <input className='customView-div' type='password' value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                ) : (
                    <div className='customView-div'><input className='customView-div' type='password' placeholder='********' disabled></input></div>
                )}
                <hr className='customProfile-hr'></hr>


                <div className='customProfile-div'>New password</div>
                {isEditing ? (
                    <input className='customView-div' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                ) : (
                    <div className='customView-div'><input className='customView-div' type='password' placeholder='********' disabled></input></div>
                )}
                <hr className='customProfile-hr'></hr>

                <div className='customProfile-div'>Repeat new password</div>
                {isEditing ? (
                    <input className='customView-div' type='password' value={repeatPassword} onChange={(e) => setRepeatPassowrd(e.target.value)} />
                ) : (
                    <div className='customView-div'><input className='customView-div' type='password' placeholder='********' disabled></input></div>
                )}
                <hr className='customProfile-hr'></hr>

                <br></br>
                {/* Save and Cancel buttons */}
                {isEditing ? (
                    <div>
                        <button className='edit-button' onClick={handleSaveClick}>Save</button>
                        <button className='edit-button' onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                ) : (
                    <div><button className='edit-button' onClick={handleEditClick}>Edit</button></div>
                )}


            </div>
        </div>
    );
}
