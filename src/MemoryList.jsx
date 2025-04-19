import MemoryItem from './MemoryItem';
import './MemoryList.css';

function MemoryList({ memories, tripId, onMemorySelect, onDeleteMemory, lastAddedMemoryId }) {
  const memoryArray = Object.values(memories);

  return (
    <div className="memory-list">
      <h3>Memories</h3>
      {memoryArray.length === 0 ? (
        <p>No memories recorded yet. Add some memories from your trip!</p>
      ) : (
        <ul className="memories">
          {memoryArray.map(memory => (
            <li key={memory.id} className="memory">
              <MemoryItem
                memory={memory}
                isLastAdded={lastAddedMemoryId === memory.id}
                onMemorySelect={onMemorySelect}
                onDeleteMemory={onDeleteMemory}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MemoryList;
