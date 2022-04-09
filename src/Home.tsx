import React from 'react';
import './Home.css'

const Home = () => {
  return (
    <body>
      <h1 className="title-home">SPAMAZON</h1>
      <div className="container">
        <h2 className="title-h1">Welcome home</h2>
        <p><a href="/checkout">Click here to view our product</a></p>
      </div>
    </body>
    
  );
}

export default Home;