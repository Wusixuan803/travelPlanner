import { useState, useEffect } from 'react';
import TripItem from './TripItem';
import Pagination from './Pagination';
import SearchFilter from './SearchFilter';
import { fetchTripsPaginated } from './services';
import { TRIP_CATEGORIES, ITEMS_PER_PAGE } from './constants';
import './TripList.css';

function TripList({ trips, onTripSelect, onDeleteTrip, lastAddedTripId, userRole, username }) {
  const [filteredTrips, setFilteredTrips] = useState({});
  const [filters, setFilters] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: ITEMS_PER_PAGE,
    totalTrips: 0,
    totalPages: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const POLLING_INTERVAL = 30000; 
  
  useEffect(() => {
    loadTrips();
    
    const intervalId = setInterval(() => {
      loadTrips();
    }, POLLING_INTERVAL);
    
    return () => clearInterval(intervalId);
  }, [pagination.page, filters]);
  
  const loadTrips = () => {
    setLoading(true);
    fetchTripsPaginated(pagination.page, pagination.limit, filters)
      .then(data => {
        setFilteredTrips(data.trips);
        setPagination(data.pagination);
        setLoading(false);
        setError('');
      })
      .catch(err => {
        setError(err?.error || 'Error loading trips');
        setLoading(false);
      });
  };
  
  const handlePageChange = (page) => {
    setPagination({
      ...pagination,
      page
    });
  };
  
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination({
      ...pagination,
      page: 1
    });
  };
  
  const tripArray = Object.keys(filteredTrips).length > 0 
    ? Object.values(filteredTrips) 
    : Object.values(trips);

  return (
    <div className="trip-list">
      <h2>My Trips</h2>
      
      <SearchFilter
        onFilter={handleFilterChange}
        categories={TRIP_CATEGORIES}
      />
      
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading">Loading trips...</div>
      ) : tripArray.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <span className="material-symbols-outlined">flight</span>
          </div>
          <p className="empty-state-text">
            {filters ? 'No trips match your filters.' : 'No trips yet! Create your first adventure using the form.'}
          </p>
        </div>
      ) : (
        <>
          <ul className="trips">
            {tripArray.map(trip => (
              <li key={trip.id} className="trip">
                <TripItem
                  trip={trip}
                  isLastAdded={lastAddedTripId === trip.id}
                  onTripSelect={onTripSelect}
                  onDeleteTrip={onDeleteTrip}
                  userRole={userRole} 
                  username={username}
                />
              </li>
            ))}
          </ul>
          
          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}

export default TripList;
