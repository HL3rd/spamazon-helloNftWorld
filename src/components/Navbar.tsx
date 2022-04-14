import React from 'react';

interface NavbarProps {
  walletAddress: string|null,
  userBalance: string|null,
  errorMessage: any
}

const Navbar:React.FC<NavbarProps> = ({ walletAddress, userBalance, errorMessage }) => {
 return (
 <div className="whole-top">
   <div className="top">
     <a href="/">
       <div>
         <h1 className="brand">SPAMAZON</h1>
      </div>
    </a>
    <div className="user-info">
      <p>Wallet Address: {walletAddress}</p>
      <p>Wallet Balance: {userBalance}</p>
      <p>{errorMessage}</p>
    </div>
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
    <h2 id="switching-title">Checkout Product</h2>
  </div>
  </div>
  )
}

export default Navbar;