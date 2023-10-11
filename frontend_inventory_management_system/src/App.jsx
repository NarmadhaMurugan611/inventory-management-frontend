import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Login } from './Pages/Login';
import { Register } from './Pages/Register';
import Sidebar from './Components/Sidebar';
import Dashboard from './Pages/Dashboard';
import Category from './Pages/CategoryFile/Category';
import Order from './Pages/Orders/Orders';
import Product from './Pages/Products/Product';
import ProductList from './Pages/ProductList/ProductList';
import OrderItem from './Pages/OrderItems/orderItem'
import Logout from './Pages/logout'
import Home from './Pages/Main'
import './App.css';


const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Sidebar><Dashboard /></Sidebar>} />
        <Route path="/dashboard" element={<Sidebar><Dashboard /></Sidebar>} />
        <Route path="/category" element={<Sidebar><Category /></Sidebar>} />
        <Route path="/orders" element={<Sidebar><Order /></Sidebar>} />
        <Route path="/orderitems" element={<Sidebar><OrderItem /></Sidebar>} />
        <Route path="/product" element={<Sidebar><Product /></Sidebar>} />
        <Route path="/productList" element={<Sidebar><ProductList /></Sidebar>} />
        <Route path="/Register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </div>
  );
}

export default App;
