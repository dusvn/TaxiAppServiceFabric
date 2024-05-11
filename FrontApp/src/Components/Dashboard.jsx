import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../Style/Dashboard.css';

const ButtonInCorner = () => {
  return (
    <div className="relative h-screen">
      <button className="absolute top-0 right-0 mt-4 mr-4 px-4 py-2 bg-blue-500 text-white rounded">Button</button>
      <div className="p-8">
        Content
      </div>
    </div>
  );
};

export default ButtonInCorner;

