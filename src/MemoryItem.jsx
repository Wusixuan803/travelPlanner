import './MemoryItem.css';

function MemoryItem({ memory, isLastAdded, onMemorySelect, onDeleteMemory }) {
    const formatDate = (dateStr) => {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return date.toLocaleDateString();
    };
  
    const dateDisplay = formatDate(memory.date);
    const isAddedClass = isLastAdded ? "memory__text--added" : "";
  
    return (
      <div className="memory-item">
        <div 
          className={`memory__details ${isAddedClass}`}
          onClick={() => onMemorySelect(memory.id)}
        >
          <h4 className="memory__title">{memory.title}</h4>
          {memory.description && <p className="memory__description">{memory.description}</p>}
          {dateDisplay && <p className="memory__date">{dateDisplay}</p>}
          {memory.imageUrl && (
            <div className="memory__image-container">
              <img src={memory.imageUrl} alt={memory.title} className="memory__image" />
            </div>
          )}
        </div>
        <button
          className="memory__delete"
          data-id={memory.id}
          onClick={() => onDeleteMemory(memory.id)}
        >
          <span className="material-symbols-outlined">delete</span>
        </button>
      </div>
    );
  }
  
  export default MemoryItem;
  