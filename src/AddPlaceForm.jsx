import { useState } from 'react';
import './AddPlaceForm.css';

function AddPlaceForm({ tripId, onAddPlace }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (name.trim()) {
      onAddPlace(tripId, name, description, date);
      setName('');
      setDescription('');
      setDate('');
    }
  }

  return (
    <div className="add-place-form">
      <h3>Add New Place</h3>
      <form className="add__form" action="#/add-place" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="place-name">Name:</label>
          <input
            id="place-name"
            className="add__name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Place name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="place-description">Description:</label>
          <textarea
            id="place-description"
            className="add__description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Place description (optional)"
          />
        </div>
        <div className="form-group">
          <label htmlFor="place-date">Visit Date:</label>
          <input
            id="place-date"
            className="add__date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <button type="submit" className="add__button">Add Place</button>
      </form>
    </div>
  );
}

export default AddPlaceForm;
