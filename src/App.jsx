import { useState } from 'react';
import './App.css';
import Quizbox from './Components/Quizbox';
import LandingPage from './Components/LandingPage';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';

function App() {

    return (
        <Router>
            <div id="whole-page">
                <Navbar/>
                <Routes>
                    <Route path="/" element={<LandingPage/>} />
                    <Route path="/quiz" element={<Quizbox/>} />
                </Routes>
                <Footer/>
            </div>
        </Router>
    )
}

export default App
