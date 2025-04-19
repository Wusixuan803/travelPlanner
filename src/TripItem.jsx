import './TripItem.css';

function TripItem({ trip, isLastAdded, onTripSelect, onDeleteTrip, userRole, username }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  const startDateDisplay = formatDate(trip.startDate);
  const endDateDisplay = formatDate(trip.endDate);
  const dateRange = startDateDisplay && endDateDisplay 
    ? `${startDateDisplay} - ${endDateDisplay}`
    : startDateDisplay || endDateDisplay || 'No dates set';

  const isAddedClass = isLastAdded ? "trip__text--added" : "";
  
  const categoryImages = {
    'Beach': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop',
    'City': 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&h=500&fit=crop',
    'Mountain': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=500&fit=crop',
    'Adventure': 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=500&fit=crop',
    'Culture': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&h=500&fit=crop'
  };
  
  const defaultCategories = ['Beach', 'City', 'Mountain', 'Adventure', 'Culture'];
  const categoryIndex = Math.floor(Math.abs(trip.id.charCodeAt(0)) % defaultCategories.length);
  const category = trip.category || defaultCategories[categoryIndex];
  
  const backgroundImage = categoryImages[category] || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=500&fit=crop';

  const isAdmin = userRole === 'admin';
  const isOwner = trip.username === username;
  const canDelete = isAdmin || isOwner;

  return (
    <div className={`trip-card ${isAddedClass}`}>
      <div 
        className="trip-image" 
        style={{backgroundImage: `url(${backgroundImage})`}}
      >
        <span className="trip-category">{category}</span>
      </div>
      <div className="trip-content">
        <h3 className="trip-title">{trip.title}</h3>
        <p className="trip-dates">{dateRange}</p>
        
        <div className="trip-actions">
          <button 
            className="trip-view"
            onClick={() => onTripSelect(trip.id)}
          >
            View Details
          </button>
          {canDelete && (
            <button
              className="trip-delete"
              data-id={trip.id}
              onClick={() => onDeleteTrip(trip.id)}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default TripItem;
  