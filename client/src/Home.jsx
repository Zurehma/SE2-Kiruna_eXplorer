import React from 'react';
import './styles/Home.css'

const Home = () => {
  return (
    <div className="home">
      <div className="text-container">
        <h1>Welcome to Our Office Management System</h1>
        <p>Your efficient solution for managing office queues.</p>
      </div>
      <img
        src="path/to/your/image.jpg" // Replace with your image path
        alt="Animated visual"
        className="animated-image"
      />
    </div>
  );
};

export default Home;
