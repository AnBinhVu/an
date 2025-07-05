import React from 'react';
import FeaturedListings from '../components/FeaturedListings'; 
const HomePage = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <div style={{ marginTop: '2rem' }}>
        <FeaturedListings />
      </div>
    </div>
  );
};

export default HomePage;
