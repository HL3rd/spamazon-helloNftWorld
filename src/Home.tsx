import React from 'react';
import './Home.css'
import Navbar from './components/Navbar';

const Home = () => {
  return (
    <body>
      <Navbar walletAddress={"a"} userBalance={"a"} errorMessage={"a"} /> 
      {/* walletAddress={walletAddress} userBalance={userBalance} errorMessage={errorMessage} /> */}
      

      <div className="home-content">
        {/* <p><a href="/checkout">Click here to view our product</a></p> */}
        <div className="first-row">
          <div className="home-box">
            <h4>BOX 1</h4>
            <div className="box-image">
              <img/>
            </div>
            <p><a className="product-link" href="/checkout">Click here to view our product</a></p>
          </div>

          <div className="home-box">
            <h4>BOX 2</h4>
            <div className="box-image">
              <img/>
            </div>
            <p><a className="product-link" href="/checkout">Click here to view our product</a></p>
          </div>

          <div className="home-box">
            <h4>BOX 3</h4>
            <div className="box-image">
              <img/>
            </div>
            <p><a className="product-link" href="/checkout">Click here to view our product</a></p>
          </div>

          <div className="home-box">
            <h4>BOX 4</h4>
            <div className="box-image">
              <img/>
            </div>
            <p><a className="product-link" href="/checkout">Click here to view our product</a></p>
          </div>
        </div>



        <div className="second-row">
          <div className="home-box">
            <h4>BOX 5</h4>
            <div className="box-image">
              <img/>
            </div>
            <p><a className="product-link" href="/checkout">Click here to view our product</a></p>
          </div>

          <div className="home-box">
            <h4>BOX 6</h4>
            <div className="box-image">
              <img/>
            </div>
            <p><a className="product-link" href="/checkout">Click here to view our product</a></p>
          </div>

          <div className="home-box">
            <h4>BOX 7</h4>
            <div className="box-image">
              <img/>
            </div>
            <p><a className="product-link" href="/checkout">Click here to view our product</a></p>
          </div>

          <div className="home-box">
            <h4>BOX 8</h4>
            <div className="box-image">
              <img/>
            </div>
            <p><a className="product-link" href="/checkout">Click here to view our product</a></p>
          </div>
        </div>

      </div>
    </body>
    
  );
}

export default Home;