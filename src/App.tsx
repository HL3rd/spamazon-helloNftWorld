import React from 'react';
import { Route, Routes } from "react-router-dom";

import Home from './Home';
import Checkout from './Checkout';
import Minter from './Minter';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import ProductPayments from './ProductPayments';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={ <Home /> } />
        <Route path="/payments" element={ <ProductPayments/>} />
        <Route path="/checkout/:productId" element={ <Checkout/>} />
        <Route path="/minter" element={ <Minter /> } />
        <Route path="*" element={ <Home /> } />
      </Routes>
    </div>
  );
}

export default App;
