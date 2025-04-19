import { useState, useEffect } from 'react';
import './AdminPanel.css';

function AdminPanel({ stats, onFetchStats }) {
  const [loading, setLoading] = useState(false);
  
  const POLLING_INTERVAL = 15000; 
  
  useEffect(() => {
    if (!stats) {
      onFetchStats();
    }
    
    const intervalId = setInterval(() => {
      onFetchStats();
    }, POLLING_INTERVAL);
    
    return () => clearInterval(intervalId);
  }, []);

  if (loading && !stats) {
    return <div>Loading admin panel...</div>;
  }

  return (
    <div className="admin-panel">
      <h2>Admin Dashboard</h2>
      
      <div className="stats-cards">
        <div className="stat-card">
          <h3>Total Users</h3>
          <div className="stat-value">{stats?.totalUsers || 0}</div>
        </div>
        
        <div className="stat-card">
          <h3>Total Trips</h3>
          <div className="stat-value">{stats?.totalTrips || 0}</div>
        </div>
      </div>
      
      <div className="stats-row">
        <div className="category-stats">
          <h3>Trips by Category</h3>
          {!stats?.tripsByCategory || Object.keys(stats.tripsByCategory).length === 0 ? (
            <p>No category data available</p>
          ) : (
            <ul className="category-list">
              {Object.entries(stats.tripsByCategory).map(([category, count]) => (
                <li key={category} className="category-item">
                  <span className="category-name">{category}</span>
                  <span className="category-count">{count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
