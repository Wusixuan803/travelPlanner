import { useState, useEffect } from 'react';
import './Navigation.css';
import { VIEW_STATES } from './constants';
import { USER_ROLES, PERMISSIONS, hasPermission } from './permissions';

function Navigation({ viewState, setViewState, viewHistory, setViewHistory, userRole }) {
  const navigateTo = (view) => {
    setViewState(view);
    setViewHistory([...viewHistory, view]);
  };
  
  const goBack = () => {
    if (viewHistory.length > 1) {
      const newHistory = [...viewHistory];
      newHistory.pop(); 
      const previousView = newHistory[newHistory.length - 1];
      setViewState(previousView);
      setViewHistory(newHistory);
    }
  };

  return (
    <div className="navigation">
      <div className="nav-buttons">
        <button
          className={viewState === VIEW_STATES.TRIPS_LIST ? 'active' : ''}
          onClick={() => navigateTo(VIEW_STATES.TRIPS_LIST)}
        >
          My Trips
        </button>
        
        {hasPermission(userRole, PERMISSIONS.VIEW_STATS) && (
          <button
            className={viewState === VIEW_STATES.STATS ? 'active' : ''}
            onClick={() => navigateTo(VIEW_STATES.STATS)}
          >
            Statistics
          </button>
        )}
      </div>
      
      {viewHistory.length > 1 && (
        <button className="back-button" onClick={goBack}>
          <span className="material-symbols-outlined">arrow_back</span> Back
        </button>
      )}
    </div>
  );
}

export default Navigation;
