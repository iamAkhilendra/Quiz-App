import React from 'react';
import './LandingPage.css';
import { Link } from 'react-router-dom';

export default function LandingPage() {
    return (
        <div id='whole-landing-page'>
            <p>Ready to test your knowledge? Dive into the fun and challenging quiz now!</p>
            <Link id="landing-page-button" className="buttons" to={"/quiz"}>Start the Quiz</Link>
        </div>
    )
}
