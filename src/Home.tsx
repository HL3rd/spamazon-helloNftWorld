import React from 'react';
import './Home.css'

const Home = () => {
  return (
    <body>
      <div className="whole-top">
        <div className="top">
          <a href="/">
            <div>
              <h1 className="brand">SPAMAZON</h1>
            </div>
          </a>
          
          <a href="/checkout">
            <div>
              <h2 className="checkout">Checkout</h2>
            </div>
          </a>
        </div>

        <div className="second-top">
          <h3>Spam</h3>
          <h3>Spam</h3>
          <h3>Spam</h3>
          <h3>Spam</h3>
          <h3>Spam</h3>
          <h3>Spam</h3>
          <h3>Spam</h3>
          <h3>Spam</h3>
          <h3>Spam</h3>
          <h3>Spam</h3>
          <h3>Spam</h3>
          <h3>Spam</h3>
          <h3>Spam</h3>
        </div>

        <div className="fourth-top">
          <h2>Welcome home</h2>
        </div>
      </div>


      <div>
        {/* <h2 className="title">Welcome home</h2> */}
        <p><a href="/checkout">Click here to view our product</a></p>
      </div>
    </body>
    
  );
}

export default Home;