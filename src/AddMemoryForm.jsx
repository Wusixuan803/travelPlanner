import { useState } from 'react';
import './AddMemoryForm.css';

function AddMemoryForm({ tripId, places, onAddMemory }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [placeId, setPlaceId] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (title.trim()) {
      onAddMemory(tripId, title, description, date, imageUrl, placeId || null);
      setTitle('');
      setDescription('');
      setDate('');
      setImageUrl('');
      setPlaceId('');
    }
  }

  const placesArray = Object.values(places || {});

  return (
    <div className="add-memory-form">
      <h3>Add New Memory</h3>
      <form className="add__form" action="#/add-memory" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="memory-title">Title:</label>
          <input
            id="memory-title"
            className="add__title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Memory title"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="memory-description">Description:</label>
          <textarea
            id="memory-description"
            className="add__description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Memory description (optional)"
          />
        </div>
        <div className="form-group">
          <label htmlFor="memory-date">Date:</label>
          <input
            id="memory-date"
            className="add__date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="memory-image">Image URL:</label>
          <input
            id="memory-image"
            className="add__image"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Link to image (optional)"
          />
        </div>
        {placesArray.length > 0 && (
          <div className="form-group">
            <label htmlFor="memory-place">Associated Place:</label>
            <select
              id="memory-place"
              className="add__place"
              value={placeId}
              onChange={(e) => setPlaceId(e.target.value)}
            >
              <option value="">-- Select a place (optional) --</option>
              {placesArray.map(place => (
                <option key={place.id} value={place.id}>
                  {place.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <button type="submit" className="add__button">Add Memory</button>
      </form>
    </div>
  );
}

export default AddMemoryForm;
