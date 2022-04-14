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