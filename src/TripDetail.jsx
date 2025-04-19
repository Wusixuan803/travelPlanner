import "./TripDetail.css";

function TripDetail({
  trip,
  onBack,
  places,
  onShowAddPlaceForm,
  memories,
  onShowAddMemoryForm,
  userRole,
  username 
}) {
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  if (!trip) {
    return (
      <div className="trip-detail">
        <button className="back-button" onClick={onBack}>
          ← Back to Trips
        </button>
        <div className="error-message">
          Trip details could not be loaded. Please try again.
        </div>
      </div>
    );
  }

  const startDateDisplay = formatDate(trip.startDate);
  const endDateDisplay = formatDate(trip.endDate);
  const dateRange =
    startDateDisplay && endDateDisplay
      ? `${startDateDisplay} - ${endDateDisplay}`
      : startDateDisplay || endDateDisplay || "No dates set";

  const category_backgrounds = {
    Beach: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop",
    City: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&h=500&fit=crop",
    Mountain: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=500&fit=crop",
    Adventure: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=500&fit=crop",
    Culture: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&h=500&fit=crop",
  };

  const categories = ["Beach", "City", "Mountain", "Adventure", "Culture"];
  const categoryIndex = Math.floor(
    Math.abs(trip.id.charCodeAt(0)) % categories.length
  );
  const category = trip.category || categories[categoryIndex];
  const backgroundImage = trip.imageUrl || category_backgrounds[category] || category_backgrounds.Adventure;

  const isOwnTrip = !trip.username || trip.username === username;
  const ownerText = isOwnTrip ? "Your trip" : `Trip by ${trip.username}`;

  const showAddButtons = isOwnTrip || userRole === 'admin';

  return (
    <div className="trip-detail">
      <button className="back-button" onClick={onBack}>
        ← Back to Trips
      </button>

      <div className="trip-header">
        <div
          className="trip-detail-image"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
        <h2>{trip.title}</h2>
        <div className="trip-meta">
          <span className="trip-category-badge">{category}</span>
          <p className="trip-dates">{dateRange}</p>
          {/* 添加所有者信息 */}
          {userRole === 'admin' && !isOwnTrip && (
            <p className="trip-owner">{ownerText}</p>
          )}
        </div>
      </div>

      {trip.description && (
        <div className="trip-description-section">
          <h3>About this trip</h3>
          <p>{trip.description}</p>
        </div>
      )}

      <div className="trip-itinerary">
        <h3>Trip Itinerary</h3>
        <div className="itinerary-timeline">
          <div className="timeline-item">
            <div className="timeline-point"></div>
            <div className="timeline-content">
              <p>
                {isOwnTrip ? "Your" : "This"} adventure begins! 
                {isOwnTrip ? " Add places to visit and memories to capture." : ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="trip-sections">
        {/* PLACES */}
        <div className="places-section">
          <h3>Places to Visit</h3>
          <div className="section-content">
            {places.length === 0 && (
              <p>{isOwnTrip ? "Start adding destinations to your trip!" : "No places added to this trip yet."}</p>
            )}
            {places.length >= 1 && (
              <div className="trip-item">
                <p>
                  <strong>Place 1: {places[0].name}</strong>
                </p>
                <p>
                  <em>Date:</em> {formatDate(places[0].date)}
                </p>
                <p>
                  <em>Description:</em> {places[0].description}
                </p>
              </div>
            )}
            {places.length >= 2 && (
              <div className="trip-item">
                <p>
                  <strong>Place 2: {places[1].name}</strong>
                </p>
                <p>
                  <em>Date:</em> {formatDate(places[1].date)}
                </p>
                <p>
                  <em>Description:</em> {places[1].description}
                </p>
              </div>
            )}
            {places.length >= 3 && (
              <div className="trip-item">
                <p>
                  <strong>Place 3: {places[2].name}</strong>
                </p>
                <p>
                  <em>Date:</em> {formatDate(places[2].date)}
                </p>
                <p>
                  <em>Description:</em> {places[2].description}
                </p>
              </div>
            )}
            {places.length > 3 && <p>Only showing first 3 places.</p>}

            {showAddButtons && (
              <button
                className="add-button"
                onClick={() => onShowAddPlaceForm(trip.id)}
              >
                Add a Place
              </button>
            )}
          </div>
        </div>

        {/* MEMORIES */}
        <div className="memories-section">
          <h3>Memories</h3>
          <div className="section-content">
            {memories.length === 0 && (
              <p>{isOwnTrip ? "Capture your favorite moments from this trip!" : "No memories recorded for this trip yet."}</p>
            )}
            {memories.length >= 1 && (
              <div className="trip-item">
                <p><strong>Memory 1: {memories[0].title}</strong></p>
                <p><em>Description:</em> {memories[0].description}</p>
                {memories[0].placeId &&
                  places.find((p) => p.id === memories[0].placeId) && (
                    <p><em>Location:</em> {places.find((p) => p.id === memories[0].placeId).name}</p>
                  )}
                {memories[0].imageUrl && (
                  <img
                    src={memories[0].imageUrl}
                    alt="Memory"
                    className="memory-image"
                  />
                )}
              </div>
            )}
            {memories.length >= 2 && (
              <div className="trip-item">
                <p>
                  <strong>Memory 2: {memories[1].title}</strong>
                </p>
                <p>
                  <em>Description:</em> {memories[1].description}
                </p>
                {memories[1].placeId &&
                  places.find((p) => p.id === memories[1].placeId) && (
                    <p><em>Location:</em> {places.find((p) => p.id === memories[1].placeId).name}</p>
                  )}
                {memories[1].imageUrl && (
                  <img
                    src={memories[1].imageUrl}
                    alt="Memory"
                    className="memory-image"
                  />
                )}
              </div>
            )}
            {memories.length >= 3 && (
              <div className="trip-item">
                <p>
                  <strong>Memory 3: {memories[2].title}</strong>
                </p>
                <p>
                  <em>Description:</em> {memories[2].description}
                </p>
                {memories[2].placeId &&
                  places.find((p) => p.id === memories[2].placeId) && (
                    <p><em>Location:</em> {places.find((p) => p.id === memories[2].placeId).name}</p>
                  )}
                {memories[2].imageUrl && (
                  <img
                    src={memories[2].imageUrl}
                    alt="Memory"
                    className="memory-image"
                  />
                )}
              </div>
            )}
            {memories.length > 3 && <p>Only showing first 3 memories.</p>}

            {showAddButtons && (
              <button
                className="add-button"
                onClick={() => onShowAddMemoryForm(trip.id)}
              >
                Add a Memory
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TripDetail;
