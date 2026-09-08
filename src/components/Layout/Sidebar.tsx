import React, { useState } from 'react';
import { useSpotify } from '../../context/SpotifyContext';
import { FaSpotify, FaSignOutAlt } from 'react-icons/fa';
import { FiCheckCircle, FiCircle, FiTarget, FiClock } from 'react-icons/fi';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const { isAuthenticated, login, logout } = useSpotify();
  const [tasks, setTasks] = useState<string[]>([]);
  const [newTask, setNewTask] = useState('');

  const addTask = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTask.trim()) {
      setTasks([...tasks, newTask.trim()]);
      setNewTask('');
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="logo">
          <span className="logo-icon">🔒</span>
          lockin
        </h1>
        <p className="subtitle">focus cockpit</p>
      </div>

      <div className="spotify-section">
        {isAuthenticated ? (
          <div className="spotify-status">
            <span className="status-dot online"></span>
            <span className="status-text">Connected to Spotify</span>
            <button onClick={logout} className="btn-icon">
              <FaSignOutAlt />
            </button>
          </div>
        ) : (
          <button onClick={login} className="btn-spotify">
            <FaSpotify />
            Connect Spotify
          </button>
        )}
      </div>

      <div className="sidebar-stats">
        <div className="stat-item">
          <FiClock className="stat-icon" />
          <div>
            <span className="stat-value">0</span>
            <span className="stat-label">min today</span>
          </div>
        </div>
        <div className="stat-item">
          <FiTarget className="stat-icon" />
          <div>
            <span className="stat-value">0%</span>
            <span className="stat-label">of 2h target</span>
          </div>
        </div>
      </div>

      <div className="sidebar-section">
        <h3 className="section-title">Today's Goals</h3>
        <div className="task-list">
          {tasks.map((task, index) => (
            <div key={index} className="task-item">
              <FiCircle className="task-check" />
              <span>{task}</span>
            </div>
          ))}
          <input
            type="text"
            placeholder="add a task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={addTask}
            className="task-input"
          />
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="completed-section">
          <h4 className="section-title">Completed</h4>
          <div className="completed-items">
            <div className="completed-item">
              <FiCheckCircle className="completed-icon" />
              <span>Task example</span>
            </div>
          </div>
        </div>
        <button className="btn-clear">clear completed</button>
      </div>
    </aside>
  );
};

export default Sidebar;