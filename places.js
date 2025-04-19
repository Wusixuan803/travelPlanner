import { randomUUID as uuid } from 'crypto';

function makePlaces() {
  const places = {};
  
  return {
    getPlaces: function() {
      return places;
    },
    
    getPlacesByTrip: function(tripId) {
      const tripPlaces = {};
      Object.keys(places).forEach(id => {
        if (places[id].tripId === tripId) {
          tripPlaces[id] = places[id];
        }
      });
      return tripPlaces;
    },
    
    getPlace: function(id) {
      return places[id];
    },
    
    addPlace: function(tripId, name, description, date) {
      const id = uuid();
      places[id] = {
        id,
        tripId,
        name,
        description: description || '',
        date: date || null,
        createdAt: new Date().toISOString()
      };
      return id;
    },
    
    updatePlace: function(id, updates) {
      places[id].name = updates.name || places[id].name;
      places[id].description = updates.description ?? places[id].description;
      places[id].date = updates.date ?? places[id].date;
    },
    
    deletePlace: function(id) {
      delete places[id];
    },
    
    contains: function(id) {
      return !!places[id];
    }
  };
}

export default {
  makePlaces
};
