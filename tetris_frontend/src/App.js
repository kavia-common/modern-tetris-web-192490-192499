import React, { useState, useEffect } from 'react';
import './index.css';
import './App.css';
import Game from './components/Game';

// PUBLIC_INTERFACE
function App() {
  /** Main application component hosting the Tetris Game with theme toggle. */
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    /** Toggle between light and dark theme. */
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="App">
      <header className="app-header container">
        <div className="brand">
          <span className="dot" aria-hidden="true" />
          <span className="title">Modern Tetris</span>
          <span className="badge" style={{ marginLeft: 8, background: 'rgba(37,99,235,0.12)', borderColor: 'rgba(37,99,235,0.25)' }}>
            Ocean Professional
          </span>
        </div>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </header>

      <main className="container">
        {/* Render the full Game experience (board, sidebar, controls). */}
        <Game />
      </main>

      <footer className="app-footer container">
        Built with React • Use arrow keys, Z/X or ↑ to rotate, Space to hard drop, P pause, R restart
      </footer>
    </div>
  );
}

export default App;
