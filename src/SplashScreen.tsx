import React, { useEffect, useState } from 'react';
import './SplashScreen.css';

const SplashScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const quotes = [
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Code is like humor. When you have to explain it, it’s bad. - Cory House",
    "First, solve the problem. Then, write the code. - John Johnson",
    "Experience is the name everyone gives to their mistakes. - Oscar Wilde",
    "In order to be irreplaceable, one must always be different. - Coco Chanel"
  ];
  const [quote, setQuote] = useState(quotes[0]);

  const [equation, setEquation] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    const quoteInterval = setInterval(() => {
      setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, 5000);

    // Update the equation dynamically (Laplace or wave equations, etc.)
    const equationInterval = setInterval(() => {
      const equations = [
        "F(s) = L{f(t)} = ∫[0,∞] e^(-st)f(t) dt",
        "Laplace Transform: F(s) = 1 / (s^2 + 1)",
        "e^(ix) = cos(x) + i sin(x)",
        "y''(t) + 3y'(t) + 2y(t) = 0",
        "A * e^(-st) + B * e^(st) = 0"
      ];
      setEquation(equations[Math.floor(Math.random() * equations.length)]);
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(quoteInterval);
      clearInterval(equationInterval);
    };
  }, [quotes]);

  return (
    <div className="splash-container">
      <div className="splash-left">
        <div className="glass-card">
          <img
            src="https://mir-s3-cdn-cf.behance.net/project_modules/disp/7df0bd42774743.57ee5f32bd76e.gif"
            alt="IDE Illustration"
            className="splash-image"
          />
        </div>
      </div>
      <div className="splash-right">
        <div className="glass-card splash-content">
          <h1 className="splash-title">Laplace IDE</h1>
          <p className="splash-subtitle">Powered by Niti</p>
          <p className="splash-details">Final Year Project, SNMIMT, ECE Dept</p>
          <p className="splash-quote">{quote}</p>

          {/* Fun Mathematical Animation */}
          <div className="equation-container">
            <p className="equation-text">{equation}</p>
            <div className="equation-animation">
              <div className="wave-animation"></div>
            </div>
          </div>

          <div className="splash-progress-container">
            <div
              className="splash-progress-bar"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <p className="splash-loading">Loading, please wait...</p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
