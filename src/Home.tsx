import React from 'react';
import './Home.css'
import Navbar from './components/Navbar';
import { Product } from './constants/class-objects';

const Home = () => {
  const testProduct:Product = {
    description: 'A new revolutionary product A new revolutionary product A new revolutionary product A new revolutionary product A new revolutionary product A new revolutionary product A new revolutionary product',
    productImageUrls: ['https://images-na.ssl-images-amazon.com/images/I/91TvWl33h4L.jpg', "https://i.kym-cdn.com/entries/icons/mobile/000/006/026/NOTSUREIF.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Giraffa_camelopardalis_angolensis.jpg/1024px-Giraffa_camelopardalis_angolensis.jpg"],
    id: '00000',
    isListed: true,
    name: 'Guide to the Universe Book',
    price: 10000,
    quantity: 100,
  };


  return (
    <div>
      <Navbar walletAddress={"a"} userBalance={"a"} title={"Shopping"} errorMessage={"a"} /> 
      {/* walletAddress={walletAddress} userBalance={userBalance} errorMessage={errorMessage} /> */}
      

      <div className="home-content">
        {/* <p><a href="/checkout">Click here to view our product</a></p> */}
        <div className="first-row">
          <div className="home-box">
            <h4>Pick Up Where You Left Off: Kitchen Products</h4>
            <div className="box-image">
              <img className="box-image-link" src="https://firebasestorage.googleapis.com/v0/b/sp-hellonftworld.appspot.com/o/publicProductImages%2Fjuicero.png?alt=media&token=7e38e04d-fa93-4ab8-bb12-f30b10e63616"/>
            </div>
            <p><a className="product-link" href="/checkout">Click here to view our product</a></p>
          </div>

          <div className="home-box">
            <h4>Trending Apparel</h4>
            <div className="box-image">
              <img className="box-image-link" src="https://firebasestorage.googleapis.com/v0/b/sp-hellonftworld.appspot.com/o/publicProductImages%2Fspam_costume.png?alt=media&token=70beb50b-9a28-42f2-bbfa-c7c2ecb1ed9e"/>
            </div>
            <p><a className="product-link" href="/checkout">Click here to view our product</a></p>
          </div>

          <div className="home-box">
            <h4>Buy Some Frens</h4>
            <div className="box-image">
              <img className="box-image-link" src="https://firebasestorage.googleapis.com/v0/b/sp-hellonftworld.appspot.com/o/publicProductImages%2Frobot.png?alt=media&token=26528dbb-371d-4067-b3cd-5deb9d32cac0"/>
            </div>
            <p><a className="product-link" href="/checkout">Click here to view our product</a></p>
          </div>

          <div className="home-box">
            <h4>Buy Again</h4>
            <div className="box-image">
              <img className="box-image-link" src="https://firebasestorage.googleapis.com/v0/b/sp-hellonftworld.appspot.com/o/publicProductImages%2Fspam_food.png?alt=media&token=27444bb1-f609-4908-a1d7-904051d50a0a"/>
            </div>
            <p><a className="product-link" href="/checkout">Click here to view our product</a></p>
          </div>
        </div>



        <div className="second-row">
          <div className="home-box">
            <h4>At Home Health</h4>
            <div className="box-image">
              <img className="box-image-link" src="https://firebasestorage.googleapis.com/v0/b/sp-hellonftworld.appspot.com/o/publicProductImages%2Ftheranos%202.png?alt=media&token=af6300e5-e876-4593-b034-8e871bce504b"/>
            </div>
            <p><a className="product-link" href="/checkout">Click here to view our product</a></p>
          </div>

          <div className="home-box">
            <h4>Deal Of The Day</h4>
            <div className="box-image">
              <img className="box-image-link" src="https://firebasestorage.googleapis.com/v0/b/sp-hellonftworld.appspot.com/o/publicProductImages%2FGroup%201.png?alt=media&token=057e2b8b-1e88-485d-b87d-cdf732d9a004"/>
            </div>
            <p><a className="product-link" href="/checkout">Click here to view our product</a></p>
          </div>

          <div className="home-box">
            <h4>Brooms For Sweeping Any Floor</h4>
            <div className="box-image">
              <img className="box-image-link" src="https://firebasestorage.googleapis.com/v0/b/sp-hellonftworld.appspot.com/o/publicProductImages%2Fbroom2%201.png?alt=media&token=6cb36cbf-fb39-4fb0-8477-2b9b47d31674"/>
            </div>
            <p><a className="product-link" href="/checkout">Click here to view our product</a></p>
          </div>

          <div className="home-box">
            <h4>Keep Shopping For</h4>
            <div className="box-image">
              <img className="box-image-link" src="https://firebasestorage.googleapis.com/v0/b/sp-hellonftworld.appspot.com/o/publicProductImages%2Fmutant%201.png?alt=media&token=51b60c8a-e7f9-4e49-9443-5eedd0eb29ce"/>
            </div>
            <p><a className="product-link" href="/checkout">Click here to view our product</a></p>
          </div>
        </div>

      </div>
    </div>
    
  );
}

export default Home;