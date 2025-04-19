import './PlaceItem.css';

function PlaceItem({ place, isLastAdded, onPlaceSelect, onDeletePlace }) {
    const formatDate = (dateStr) => {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return date.toLocaleDateString();
    };
  
    const dateDisplay = formatDate(place.date);
    const isAddedClass = isLastAdded ? "place__text--added" : "";
  
    return (
      <div className="place-item">
        <div 
          className={`place__details ${isAddedClass}`}
          onClick={() => onPlaceSelect(place.id)}
        >
          <h4 className="place__name">{place.name}</h4>
          {place.description && <p className="place__description">{place.description}</p>}
          {dateDisplay && <p className="place__date">{dateDisplay}</p>}
        </div>
        <button
          className="place__delete"
          data-id={place.id}
          onClick={() => onDeletePlace(place.id)}
        >
          <span className="material-symbols-outlined">delete</span>
        </button>
      </div>
    );
  }
  
  export default PlaceItem;
  