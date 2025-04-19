import { randomUUID as uuid } from 'crypto';

function makeMemories() {
  const memories = {};
  
  return {
    getMemories: function() {
      return memories;
    },
    
    getMemoriesByTrip: function(tripId) {
      const tripMemories = {};
      Object.keys(memories).forEach(id => {
        if (memories[id].tripId === tripId) {
          tripMemories[id] = memories[id];
        }
      });
      return tripMemories;
    },
    
    getMemoriesByPlace: function(placeId) {
      const placeMemories = {};
      Object.keys(memories).forEach(id => {
        if (memories[id].placeId === placeId) {
          placeMemories[id] = memories[id];
        }
      });
      return placeMemories;
    },
    
    getMemory: function(id) {
      return memories[id];
    },
    
    addMemory: function(tripId, title, description, date, imageUrl, placeId) {
      const id = uuid();
      memories[id] = {
        id,
        tripId,
        placeId: placeId || null,
        title,
        description: description || '',
        date: date || null,
        imageUrl: imageUrl || '',
        createdAt: new Date().toISOString()
      };
      return id;
    },
    
    updateMemory: function(id, updates) {
      memories[id].title = updates.title || memories[id].title;
      memories[id].description = updates.description ?? memories[id].description;
      memories[id].date = updates.date ?? memories[id].date;
      memories[id].imageUrl = updates.imageUrl ?? memories[id].imageUrl;
      memories[id].placeId = updates.placeId ?? memories[id].placeId;
    },
    
    deleteMemory: function(id) {
      delete memories[id];
    },
    
    contains: function(id) {
      return !!memories[id];
    }
  };
}

export default {
  makeMemories
};
