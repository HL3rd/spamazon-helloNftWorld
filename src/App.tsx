import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from './Home';
import Checkout from './Checkout';

import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={ <Home /> } />
        <Route path="/checkout" element={ <Checkout/>} />
      </Routes>
    </div>
  );
}

export default App;
