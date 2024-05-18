import React from 'react';
import '../Style/DriversView.css'; // Import your CSS file for styling
import { ChangeDriverStatus } from '../Services/AdminService.js';

export default function DriversView(props) {
    const driversList = props.driversView.drivers;
    const token = localStorage.getItem('token');
    const apiEndpoint = process.env.REACT_APP_CHANGE_DRIVER_STATUS;
    const handleChangeStatus = async (email, isBlocked) => {
        await ChangeDriverStatus(apiEndpoint,email, !isBlocked,token); // Toggle the isBlocked value
        
    };

    return (
        <div className="centered">
            <table className="styled-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Username</th>
                        <th>Average rating</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {driversList.map((val, key) => {
                        return (
                            <tr key={val.email}>
                                <td>{val.name}</td>
                                <td>{val.lastName}</td>
                                <td>{val.email}</td>
                                <td>{val.username}</td>
                                <td>{val.averageRating}</td>
                                <td>
                                    {val.isBlocked ? (
                                        <button className="green-button" onClick={() => handleChangeStatus(val.email, val.isBlocked)}>Unblock</button>
                                    ) : (
                                        <button className="red-button" onClick={() => handleChangeStatus(val.email, val.isBlocked)}>Block</button>
                                    )}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
}
