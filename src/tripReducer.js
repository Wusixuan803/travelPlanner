export const initialTripState = {
  trips: {},
  loading: false,
  error: null,
  selectedTripId: null,
  lastAddedTripId: null,
  filter: null,
  page: 1,
  limit: 10,
  totalPages: 1,
};

export function tripReducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };

    case "SET_TRIPS":
      return {
        ...state,
        trips: action.payload,
        loading: false,
      };

    case "ADD_TRIP":
      return {
        ...state,
        trips: {
          ...state.trips,
          [action.payload.id]: action.payload,
        },
        lastAddedTripId: action.payload.id,
        loading: false,
      };

    case "UPDATE_TRIP":
      return {
        ...state,
        trips: {
          ...state.trips,
          [action.payload.id]: {
            ...state.trips[action.payload.id],
            ...action.payload.updates,
          },
        },
        loading: false,
      };

    case "DELETE_TRIP":
      const newTrips = { ...state.trips };
      delete newTrips[action.payload];
      return {
        ...state,
        trips: newTrips,
        loading: false,
      };

    case "SELECT_TRIP":
      return {
        ...state,
        selectedTripId: action.payload,
      };

    case "SET_FILTER":
      return {
        ...state,
        filter: action.payload,
        page: 1, 
      };

    case "SET_PAGE":
      return {
        ...state,
        page: action.payload,
      };

    case "SET_PAGINATION":
      return {
        ...state,
        page: action.payload.page,
        limit: action.payload.limit,
        totalPages: action.payload.totalPages,
      };

    default:
      return state;
  }
}
