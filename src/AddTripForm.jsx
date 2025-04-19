import { useState } from 'react';
import { validateTripForm } from './validation';
import './AddTripForm.css';

function AddTripForm({ onAddTrip }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [category, setCategory] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  function handleSubmit(e) {
    e.preventDefault();
    
    const formData = { title, description, startDate, endDate, category };
    const validationErrors = validateTripForm(formData);
    setErrors(validationErrors);
    
    const touchedFields = {};
    Object.keys(formData).forEach(field => touchedFields[field] = true);
    setTouched(touchedFields);
    
    if (Object.keys(validationErrors).length === 0) {
      onAddTrip(title, description, startDate, endDate, category);
      setTitle('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setCategory('');
      setErrors({});
      setTouched({});
    }
  }
  
  function handleBlur(field) {
    setTouched({
      ...touched,
      [field]: true
    });
    
    const formData = { title, description, startDate, endDate, category };
    const validationErrors = validateTripForm(formData);
    setErrors(validationErrors);
  }

  return (
    <div className="add-trip-form">
      <h2>Add New Trip</h2>
      <form className="add__form" action="#/add" onSubmit={handleSubmit}>
        <div className={`form-group ${errors.title && touched.title ? 'error' : ''}`}>
          <label htmlFor="trip-title">Title:</label>
          <input
            id="trip-title"
            className="add__title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => handleBlur('title')}
            placeholder="Trip title"
            required
          />
          {errors.title && touched.title && (
            <div className="error-message">{errors.title}</div>
          )}
        </div>
        
        <div className={`form-group ${errors.category && touched.category ? 'error' : ''}`}>
          <label htmlFor="trip-category">Category:</label>
          <select
            id="trip-category"
            className="add__category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            onBlur={() => handleBlur('category')}
          >
            <option value="">-- Select a category --</option>
            <option value="Beach">Beach Vacation</option>
            <option value="City">City Exploration</option>
            <option value="Mountain">Mountain Hiking</option>
            <option value="Adventure">Adventure Trip</option>
            <option value="Culture">Cultural Experience</option>
          </select>
          {errors.category && touched.category && (
            <div className="error-message">{errors.category}</div>
          )}
        </div>
        
        <div className={`form-group ${errors.description && touched.description ? 'error' : ''}`}>
          <label htmlFor="trip-description">
            Description:
            {category === 'Adventure' && <span className="required">*</span>}
          </label>
          <textarea
            id="trip-description"
            className="add__description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={() => handleBlur('description')}
            placeholder={category === 'Adventure' ? "Required for Adventure trips" : "Trip description (optional)"}
            rows="3"
          />
          {errors.description && touched.description && (
            <div className="error-message">{errors.description}</div>
          )}
        </div>
        
        <div className={`form-group ${errors.startDate && touched.startDate ? 'error' : ''}`}>
          <label htmlFor="trip-start-date">Start Date:</label>
          <input
            id="trip-start-date"
            className="add__start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            onBlur={() => handleBlur('startDate')}
          />
          {errors.startDate && touched.startDate && (
            <div className="error-message">{errors.startDate}</div>
          )}
        </div>
        
        <div className={`form-group ${errors.endDate && touched.endDate ? 'error' : ''}`}>
          <label htmlFor="trip-end-date">End Date:</label>
          <input
            id="trip-end-date"
            className="add__end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            onBlur={() => handleBlur('endDate')}
          />
          {errors.endDate && touched.endDate && (
            <div className="error-message">{errors.endDate}</div>
          )}
        </div>
        
        <button type="submit" className="add__button">Add Trip</button>
      </form>
    </div>
  );
}

export default AddTripForm;
