import React, { useState } from 'react';
import '../Style/Profile.css';
import { makeImage, convertDateTimeToDateOnly, changeUserFields } from '../Services/ProfileService';

export default function EditProfile(props) {
    const user = props.user;
    const apiEndpoint = process.env.REACT_APP_CHANGE_USER_FIELDS;

    const [isEditing, setIsEditing] = useState(false);
    const [originalUser, setOriginalUser] = useState({
        username: user.username,
        address: user.address,
        birthday: convertDateTimeToDateOnly(user.birthday),
        email: user.email,
        firstName: user.firstName,
        image: makeImage(user.imageFile),
        lastName: user.lastName
    });

    const [editedUser, setEditedUser] = useState({ ...originalUser });
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newImageFile, setNewImageFile] = useState(null);
    const [newImageUrl, setNewImageUrl] = useState(originalUser.image);

    const handleCancelClick = () => {
        setEditedUser({ ...originalUser });
        setNewImageFile(null);
        setNewImageUrl(originalUser.image);
        setIsEditing(false);
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        const userToSave = {
            username: editedUser.username,
            address: editedUser.address,
            birthday: editedUser.birthday, // Assuming this is already in the desired format
            email: editedUser.email,
            firstName: editedUser.firstName,
            imageUrl: originalUser.image,
            lastName: editedUser.lastName,
            password: password,
            oldPassword: oldPassword
        };

        try {
            await changeUserFields(apiEndpoint,userToSave.firstName,userToSave.lastName,userToSave.birthday,userToSave.address,userToSave.email,userToSave.password,userToSave.imageUrl,userToSave.username,originalUser.email,localStorage.getItem('token'));
            setOriginalUser({ ...editedUser, image: newImageFile ? newImageUrl : originalUser.image });
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewImageFile(file);
            const imageUrl = URL.createObjectURL(file);
            setNewImageUrl(imageUrl);
        }
    };

    return (
        <div>
            <div className="custom-style">
                Edit profile
            </div>
            <div>
                <img src={newImageUrl} alt="User" style={{ width: '100px', height: '100px', marginLeft: '30px', marginTop: '20px', borderRadius: '50%' }} />
            </div>
            {isEditing ? (
                <div className='customView-div' style={{ marginLeft: '30px', marginTop: '20px' }}>
                    <input type='file' onChange={handleImageChange} />
                </div>
            ) : (
                <div className='customView-div'></div>
            )}

            <div style={{ marginLeft: '30px', marginTop: '20px' }}>
                <div className='customProfile-div'>Username</div>
                {isEditing ? (
                    <input className='customView-div' type='text' value={editedUser.username} onChange={(e) => setEditedUser({ ...editedUser, username: e.target.value })} />
                ) : (
                    <div className='customView-div'>{editedUser.username}</div>
                )}
                <hr className='customProfile-hr'></hr>

                <div className='customProfile-div'>First name</div>
                {isEditing ? (
                    <input className='customView-div' type='text' value={editedUser.firstName} onChange={(e) => setEditedUser({ ...editedUser, firstName: e.target.value })} />
                ) : (
                    <div className='customView-div'>{editedUser.firstName}</div>
                )}
                <hr className='customProfile-hr'></hr>

                <div className='customProfile-div'>Last name</div>
                {isEditing ? (
                    <input className='customView-div' type='text' value={editedUser.lastName} onChange={(e) => setEditedUser({ ...editedUser, lastName: e.target.value })} />
                ) : (
                    <div className='customView-div'>{editedUser.lastName}</div>
                )}
                <hr className='customProfile-hr'></hr>

                <div className='customProfile-div'>Address</div>
                {isEditing ? (
                    <input className='customView-div' type='text' value={editedUser.address} onChange={(e) => setEditedUser({ ...editedUser, address: e.target.value })} />
                ) : (
                    <div className='customView-div'>{editedUser.address}</div>
                )}
                <hr className='customProfile-hr'></hr>

                <div className='customProfile-div'>Birthday</div>
                {isEditing ? (
                    <input className='customView-div' type='text' value={editedUser.birthday} onChange={(e) => setEditedUser({ ...editedUser, birthday: e.target.value })} />
                ) : (
                    <div className='customView-div'>{editedUser.birthday}</div>
                )}
                <hr className='customProfile-hr'></hr>

                <div className='customProfile-div'>Email</div>
                {isEditing ? (
                    <input className='customView-div' type='text' value={editedUser.email} onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })} style={{ width: '250px' }} />
                ) : (
                    <div className='customView-div'>{editedUser.email}</div>
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
                    <input className='customView-div' type='password' value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} />
                ) : (
                    <div className='customView-div'><input className='customView-div' type='password' placeholder='********' disabled></input></div>
                )}
                <hr className='customProfile-hr'></hr>

                <br></br>
                {/* Save and Cancel buttons */}
                {isEditing ? (
                    <div>
                        <button className='edit-button' onClick={handleSaveClick}>Save</button>
                        <button className='edit-button' onClick={handleCancelClick}>Cancel</button>
                    </div>
                ) : (
                    <div><button className='edit-button' onClick={handleEditClick}>Edit</button></div>
                )}
            </div>
        </div>
    );
}
