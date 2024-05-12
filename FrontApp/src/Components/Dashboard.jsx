import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../Style/Dashboard.css'; // Ensure this path matches your project structure
import { MdPerson } from 'react-icons/md';
import { FaCheckCircle } from 'react-icons/fa';
import { FaCar } from 'react-icons/fa';
import { FaRoad } from 'react-icons/fa';
import { FaSignOutAlt } from 'react-icons/fa';
export default function Dashboard() {
  const [userName, setUserName] = useState('dusan.rs');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div className="black-headerDashboar flex justify-between items-center p-4">

        <button className="button-logout">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FaSignOutAlt size={25} style={{ marginRight: '4px' }} />
            <span>Sign out</span>
          </div>
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', flex: 1, justifyContent: 'flex-start' }}> {/* Added justifyContent: 'flex-start' */}


        <div style={{ width: '20%', height: '100%', backgroundColor: 'black', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', columnGap: '10px' }}>
          <div>

            <p style={{ color: "white", textAlign: "left", fontSize: "20px" }}>Hi,{userName}</p>

          </div>


          <div>
            <hr style={{ width: '330px' }}></hr> {/* Full-width horizontal line */}
          </div>


          <button className="button">

            <div style={{ display: 'flex', alignItems: 'center' }}>

              <MdPerson size={25} style={{ marginRight: '30px' }} />
              <span>Profile</span>
            </div>
          </button>

          <button className="button">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FaCheckCircle size={25} style={{ marginRight: '30px' }} />
              <span>Verify drivers</span>
            </div>
          </button>

          <button className="button">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FaCar size={25} style={{ marginRight: '30px' }} />
              <span>Drivers</span>
            </div>
          </button>

          <button className="button">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FaRoad size={25} style={{ marginRight: '30px' }} />
              <span>Rides</span>
            </div>
          </button>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: '100%', backgroundColor: 'white' }}></div>
        </div>
      </div>
    </div>
  );
}
