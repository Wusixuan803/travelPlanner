import { randomUUID as uuid } from 'crypto';

function makeTripList() {
  const trips = {};
  const places = {};
  const memories = {};

  const tripList = {};
  
  tripList.getTrips = function getTrips() {
    return trips;
  };
  
  tripList.getTrip = function getTrip(id) {
    return trips[id];
  };
  
  tripList.addTrip = function addTrip(title, description, startDate, endDate, category, username) {
    const id = uuid();
    trips[id] = {
      id,
      title,
      description: description || '',
      startDate: startDate || null,
      endDate: endDate || null,
      category: category || '',
      username: username || '', 
      createdAt: new Date().toISOString()
    };
    return id;
  };
  
  tripList.updateTrip = function updateTrip(id, trip) {
    trips[id].title = trip.title ?? trips[id].title;
    trips[id].description = trip.description ?? trips[id].description;
    trips[id].startDate = trip.startDate ?? trips[id].startDate;
    trips[id].endDate = trip.endDate ?? trips[id].endDate;
    trips[id].category = trip.category ?? trips[id].category;
  };
  
  tripList.replaceTrip = function replaceTrip(id, trip) {
    trips[id] = {
      ...trips[id],
      title: trip.title,
      description: trip.description || '',
      startDate: trip.startDate || null,
      endDate: trip.endDate || null,
      category: trip.category || '',
      updatedAt: new Date().toISOString()
    };
  };
  
  tripList.deleteTrip = function deleteTrip(id) {
    Object.keys(places).forEach(placeId => {
      if (places[placeId].tripId === id) {
        delete places[placeId];
      }
    });
    
    Object.keys(memories).forEach(memoryId => {
      if (memories[memoryId].tripId === id) {
        delete memories[memoryId];
      }
    });
    
    delete trips[id];
  };
  
  tripList.contains = function contains(id) {
    return !!trips[id];
  };
  
  tripList.getPlaces = function getPlaces(tripId) {
    const tripPlaces = {};
    Object.keys(places).forEach(id => {
      if (places[id].tripId === tripId) {
        tripPlaces[id] = places[id];
      }
    });
    return tripPlaces;
  };
  
  tripList.getPlace = function getPlace(id) {
    return places[id];
  };
  
  tripList.addPlace = function addPlace(tripId, name, description, date, includeInItinerary) {
    const id = uuid();
    places[id] = {
      id,
      tripId,
      name,
      description: description || '',
      date: date || null,
      includeInItinerary: includeInItinerary || false,
      createdAt: new Date().toISOString()
    };
    return id;
  };
  
  tripList.updatePlace = function updatePlace(id, updates) {
    places[id].name = updates.name ?? places[id].name;
    places[id].description = updates.description ?? places[id].description;
    places[id].date = updates.date ?? places[id].date;
    places[id].includeInItinerary = updates.includeInItinerary ?? places[id].includeInItinerary;
  };
  
  tripList.deletePlace = function deletePlace(id) {
    Object.keys(memories).forEach(memoryId => {
      if (memories[memoryId].placeId === id) {
        memories[memoryId].placeId = null;
      }
    });
    
    delete places[id];
  };
  
  tripList.containsPlace = function containsPlace(id) {
    return !!places[id];
  };
  
  tripList.getMemories = function getMemories(tripId) {
    const tripMemories = {};
    Object.keys(memories).forEach(id => {
      if (memories[id].tripId === tripId) {
        tripMemories[id] = memories[id];
      }
    });
    return tripMemories;
  };
  
  tripList.getMemory = function getMemory(id) {
    return memories[id];
  };
  
  tripList.addMemory = function addMemory(tripId, title, description, date, imageUrl, placeId) {
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
  };
  
  tripList.updateMemory = function updateMemory(id, updates) {
    memories[id].title = updates.title ?? memories[id].title;
    memories[id].description = updates.description ?? memories[id].description;
    memories[id].date = updates.date ?? memories[id].date;
    memories[id].imageUrl = updates.imageUrl ?? memories[id].imageUrl;
    memories[id].placeId = updates.placeId ?? memories[id].placeId;
  };
  
  tripList.deleteMemory = function deleteMemory(id) {
    delete memories[id];
  };
  
  tripList.containsMemory = function containsMemory(id) {
    return !!memories[id];
  };
  
  return tripList;
}

export default {
  makeTripList,
};
