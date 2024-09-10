import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Login } from './components/pages/Login';
import { Register } from './components/pages/Register';
import { Dashboard } from './components/pages/Dashboard';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} /> 
        <Route path="/login" element={<Login />} />       
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>      
    </Router>
  );
}

export default App;
