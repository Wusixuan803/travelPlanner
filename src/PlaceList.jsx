import PlaceItem from './PlaceItem';
import './PlaceList.css';

function PlaceList({ places, tripId, onPlaceSelect, onDeletePlace, lastAddedPlaceId }) {
  const placeArray = Object.values(places);

  return (
    <div className="place-list">
      <h3>Places to Visit</h3>
      {placeArray.length === 0 ? (
        <p>No places added yet. Add some destinations to visit!</p>
      ) : (
        <ul className="places">
          {placeArray.map(place => (
            <li key={place.id} className="place">
              <PlaceItem
                place={place}
                isLastAdded={lastAddedPlaceId === place.id}
                onPlaceSelect={onPlaceSelect}
                onDeletePlace={onDeletePlace}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PlaceList;
