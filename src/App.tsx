import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ResultsPage } from './pages/ResultsPage';
import { DetectionResult } from './types';
import './styles/cyberpunk.css';

function App() {
  const [results, setResults] = useState<DetectionResult[]>([]);

  const handleAddResult = (result: DetectionResult) => {
    setResults(prev => [...prev, result]);
  };

  return (
    <Router>
      <div className="cyberpunk-app">
        <Routes>
          <Route 
            path="/" 
            element={<HomePage onAddResult={handleAddResult} />} 
          />
          <Route 
            path="/results" 
            element={<ResultsPage results={results} />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;