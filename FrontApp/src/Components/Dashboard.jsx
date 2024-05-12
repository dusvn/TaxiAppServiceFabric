import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../Style/Dashboard.css'; // Ensure this path matches your project structure
import DashboardAdmin from './DashboardAdmin.jsx';



export default function Dashboard() {
  const [userName, setUserName] = useState('dusan.rs');
  const location = useLocation();
  const user = location.state?.user;
  const userRole = user["roles"]
  console.log("This is user:",user);
  const token = localStorage.getItem('token');
  console.log(userRole);
  return (
   <div>
     {userRole === 0 && <DashboardAdmin />}
   </div>
  );
}
