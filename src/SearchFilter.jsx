import { useState } from 'react';
import './SearchFilter.css';

function SearchFilter({ onFilter, categories }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter({
      searchTerm,
      category: selectedCategory,
      dateRange
    });
  };
  
  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setDateRange({ start: '', end: '' });
    onFilter(null);
  };

  return (
    <div className="search-filter">
      <form onSubmit={handleSubmit}>
        <div className="search-row">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search trips..."
            className="search-input"
          />
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <div className="date-range">
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            placeholder="Start date"
            className="date-input"
          />
          <span>to</span>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            placeholder="End date"
            className="date-input"
          />
        </div>
        
        <div className="filter-actions">
          <button type="submit" className="filter-button">Filter</button>
          <button type="button" onClick={handleReset} className="reset-button">Reset</button>
        </div>
      </form>
    </div>
  );
}

export default SearchFilter;
