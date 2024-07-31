import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import logo from './images/wrx.jpg';
import CarGrid from './components/CarGrid';

function Home() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/game');
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>cargrid.io</h1>
        <button className="title-screen-button" onClick={handleClick}>
          Proceed!
        </button>
      </header>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<CarGrid />} />
      </Routes>
    </Router>
  );
}

export default App;
