import React from 'react';
import Sidebar from './components/Layout/Sidebar';
import MainContent from './components/Layout/MainContent';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <MainContent />
    </div>
  );
};

export default App;