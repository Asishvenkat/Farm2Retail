import React from 'react';
import { useSelector } from 'react-redux';
import GeneralHomePage from './general';
import FarmerHomePage from './farmers/farmer';
import RetailerHomePage from '../Pages/retailers/retailer';
import Navbar from '../components/Navbar';

const Home = () => {
  const user = useSelector((state) => state.user.currentUser);

  return (
    <>
      {!user ? (
        <GeneralHomePage />
      ) : (
        <>
          {user.role === 'farmer' && <FarmerHomePage />}
          {user.role === 'retailer' && <RetailerHomePage />}
          {user.role !== 'farmer' && user.role !== 'retailer' && (
            <GeneralHomePage />
          )}
        </>
      )}
    </>
  );
};

export default Home;
