import { useState, useEffect, useReducer } from "react";
import "./App.css";
import {
  LOGIN_STATUS,
  VIEW_STATES,
  CLIENT,
  SERVER,
  ITEMS_PER_PAGE,
} from "./constants";
import { tripReducer, initialTripState } from "./tripReducer";
import { USER_ROLES, PERMISSIONS, hasPermission } from './permissions';
import {
  fetchSession,
  fetchLogin,
  fetchLogout,
  fetchRegister,
  fetchTrips,
  fetchAddTrip,
  fetchDeleteTrip,
  fetchUpdateTrip,
  fetchReplaceTrip,
  fetchPlaces,
  fetchAddPlace,
  fetchUpdatePlace,
  fetchDeletePlace,
  fetchMemories,
  fetchAddMemory,
  fetchUpdateMemory,
  fetchDeleteMemory,
  fetchUserRole,
  fetchTripsPaginated,
  fetchAdminStats, 
} from "./services";

import AuthPage from "./AuthPage";
import Controls from "./Controls";
import Status from "./Status";
import Loading from "./Loading";
import TripList from "./TripList";
import AddTripForm from "./AddTripForm";
import TripDetail from "./TripDetail";
import AddPlaceForm from "./AddPlaceForm";
import AddMemoryForm from "./AddMemoryForm";
import Navigation from "./Navigation";
import AdminPanel from "./AdminPanel";

function App() {
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState(USER_ROLES.GUEST);
  const [loginStatus, setLoginStatus] = useState(LOGIN_STATUS.PENDING);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [viewState, setViewState] = useState(VIEW_STATES.TRIPS_LIST);
  const [viewHistory, setViewHistory] = useState([VIEW_STATES.TRIPS_LIST]);
  const [loading, setLoading] = useState(false);
  const [adminStats, setAdminStats] = useState(null);
  const [tripState, tripDispatch] = useReducer(tripReducer, initialTripState);
  const [places, setPlaces] = useState({});
  const [memories, setMemories] = useState({});
  const [showAddPlaceForm, setShowAddPlaceForm] = useState(false);
  const [showAddMemoryForm, setShowAddMemoryForm] = useState(false);
  const [currentTripForForm, setCurrentTripForForm] = useState(null);

  useEffect(() => {
    if (loginStatus === LOGIN_STATUS.IS_LOGGED_IN) {
      document.body.classList.add("logged-in");
    } else {
      document.body.classList.remove("logged-in");
    }
  }, [loginStatus]);

  function onLogin(username) {
    setLoading(true);
    fetchLogin(username)
      .then((data) => {
        setError("");
        setUsername(username);
        setUserRole(data.role || USER_ROLES.USER); 
        tripDispatch({ type: 'SET_TRIPS', payload: data.trips || {} }); 
        setLoginStatus(LOGIN_STATUS.IS_LOGGED_IN);
        setLoading(false);
        return data;
      })
      .catch((err) => {
        setError(err?.error || "ERROR");
        setLoading(false);
        return Promise.reject(err); 
      });
  }

  function onRegister(username) {
    setLoading(true);
    fetchRegister(username)
      .then((data) => {
        setError("");
        setUsername(username);
        setUserRole(data.role || USER_ROLES.USER); 
        tripDispatch({ type: 'SET_TRIPS', payload: data.trips || {} }); 
        setLoginStatus(LOGIN_STATUS.IS_LOGGED_IN);
        setRegisterSuccess(true);
        setLoading(false);

        setTimeout(() => {
          setRegisterSuccess(false);
        }, 3000);
      })
      .catch((err) => {
        setError(err?.error || "ERROR");
        setLoading(false);
      });
  }

  function onLogout() {
    setError("");
    setUsername("");
    setUserRole(USER_ROLES.GUEST);
    setLoginStatus(LOGIN_STATUS.NOT_LOGGED_IN);

    tripDispatch({ type: "SET_TRIPS", payload: {} });
    tripDispatch({ type: "SELECT_TRIP", payload: null });

    setViewState(VIEW_STATES.TRIPS_LIST);
    setViewHistory([VIEW_STATES.TRIPS_LIST]);
    setPlaces({});
    setMemories({});
    setShowAddPlaceForm(false);
    setShowAddMemoryForm(false);
    setCurrentTripForForm(null);
    setAdminStats(null); 

    fetchLogout().catch((err) => {
      setError(err?.error || "ERROR");
    });
  }

  function onRefresh() {
    setLoading(true);

    if (viewState === VIEW_STATES.TRIPS_LIST) {
      fetchTripsPaginated(tripState.page, ITEMS_PER_PAGE, tripState.filter)
        .then((data) => {
          tripDispatch({ type: "SET_TRIPS", payload: data.trips });
          tripDispatch({
            type: "SET_PAGINATION",
            payload: {
              page: data.pagination.page,
              limit: data.pagination.limit,
              totalPages: data.pagination.totalPages,
            },
          });
          setLoading(false);
        })
        .catch((err) => {
          setError(err?.error || "ERROR");
          setLoading(false);
        });
    }
    else if (viewState === VIEW_STATES.STATS) {
      onFetchAdminStats();
    }
    else if (
      viewState === VIEW_STATES.TRIP_DETAIL &&
      tripState.selectedTripId
    ) {
      refreshPlacesAndMemories(tripState.selectedTripId);
    }
    else {
      fetchTrips()
        .then((trips) => {
          tripDispatch({ type: "SET_TRIPS", payload: trips });
          setLoading(false);
        })
        .catch((err) => {
          setError(err?.error || "ERROR");
          setLoading(false);
        });
    }
  }

  function refreshPlacesAndMemories(tripId) {
    setLoading(true);
    setError(""); 
    
    Promise.all([fetchPlaces(tripId), fetchMemories(tripId)])
      .then(([fetchedPlaces, fetchedMemories]) => {
        setPlaces(fetchedPlaces || {});
        setMemories(fetchedMemories || {});
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading trip details:", err);
        setError("Could not load trip details. Please try again.");
        setLoading(false);
      });
  }

  function onAddTrip(title, description, startDate, endDate, category) {
    tripDispatch({ type: "SET_LOADING", payload: true });
    setLoading(true);

    fetchAddTrip(title, description, startDate, endDate, category)
      .then((trip) => {
        tripDispatch({ type: "ADD_TRIP", payload: trip });
        setLoading(false);
      })
      .catch((err) => {
        setError(err?.error || "ERROR");
        tripDispatch({ type: "SET_ERROR", payload: err?.error || "ERROR" });
        setLoading(false);
      });
  }

  function onUpdateTrip(id, updates) {
    tripDispatch({ type: "SET_LOADING", payload: true });
    setLoading(true);

    fetchUpdateTrip(id, updates)
      .then((trip) => {
        tripDispatch({
          type: "UPDATE_TRIP",
          payload: { id, updates: trip },
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(err?.error || "ERROR");
        tripDispatch({ type: "SET_ERROR", payload: err?.error || "ERROR" });
        setLoading(false);
      });
  }

  function onDeleteTrip(id) {
    tripDispatch({ type: "SET_LOADING", payload: true });
    setLoading(true);

    fetchDeleteTrip(id)
      .then(() => {
        tripDispatch({ type: "DELETE_TRIP", payload: id });
        setLoading(false);
      })
      .catch((err) => {
        setError(err?.error || "ERROR");
        tripDispatch({ type: "SET_ERROR", payload: err?.error || "ERROR" });
        setLoading(false);
      });
  }

  function onTripSelect(id) {
    tripDispatch({ type: "SELECT_TRIP", payload: id });
    setViewState(VIEW_STATES.TRIP_DETAIL);
    setViewHistory([...viewHistory, VIEW_STATES.TRIP_DETAIL]);

    refreshPlacesAndMemories(id);
  }

  function onBack() {
    if (viewHistory.length > 1) {
      const newHistory = [...viewHistory];
      newHistory.pop(); 
      const previousView = newHistory[newHistory.length - 1];

      setViewState(previousView);
      setViewHistory(newHistory);

      if (previousView !== VIEW_STATES.TRIP_DETAIL) {
        tripDispatch({ type: "SELECT_TRIP", payload: null });
      }

      setShowAddPlaceForm(false);
      setShowAddMemoryForm(false);
    }
  }

  function onShowAddPlaceForm(tripId) {
    setCurrentTripForForm(tripId);
    setShowAddPlaceForm(true);
  }

  function onHideAddPlaceForm() {
    setShowAddPlaceForm(false);
    setCurrentTripForForm(null);
  }

  function onAddPlace(tripId, name, description, date, includeInItinerary) {
    setLoading(true);
    fetchAddPlace(tripId, name, description, date, includeInItinerary)
      .then((place) => {
        setPlaces({
          ...places,
          [place.id]: place,
        });
        setLoading(false);
        setShowAddPlaceForm(false);
      })
      .catch((err) => {
        setError(err?.error || "ERROR");
        setLoading(false);
      });
  }

  function onUpdatePlace(id, updates) {
    setLoading(true);
    fetchUpdatePlace(id, updates)
      .then((place) => {
        setPlaces({
          ...places,
          [id]: {
            ...places[id],
            ...place,
          },
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(err?.error || "ERROR");
        setLoading(false);
      });
  }

  function onDeletePlace(id) {
    setLoading(true);
    fetchDeletePlace(id)
      .then(() => {
        const newPlaces = { ...places };
        delete newPlaces[id];
        setPlaces(newPlaces);
        setLoading(false);
      })
      .catch((err) => {
        setError(err?.error || "ERROR");
        setLoading(false);
      });
  }

  function onShowAddMemoryForm(tripId) {
    setCurrentTripForForm(tripId);
    setShowAddMemoryForm(true);
  }

  function onHideAddMemoryForm() {
    setShowAddMemoryForm(false);
    setCurrentTripForForm(null);
  }

  function onAddMemory(tripId, title, description, date, imageUrl, placeId) {
    setLoading(true);
    fetchAddMemory(tripId, title, description, date, imageUrl, placeId)
      .then((memory) => {
        setMemories({
          ...memories,
          [memory.id]: memory,
        });
        setLoading(false);
        setShowAddMemoryForm(false);
      })
      .catch((err) => {
        setError(err?.error || "ERROR");
        setLoading(false);
      });
  }

  function onUpdateMemory(id, updates) {
    setLoading(true);
    fetchUpdateMemory(id, updates)
      .then((memory) => {
        setMemories({
          ...memories,
          [id]: {
            ...memories[id],
            ...memory,
          },
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(err?.error || "ERROR");
        setLoading(false);
      });
  }

  function onDeleteMemory(id) {
    setLoading(true);
    fetchDeleteMemory(id)
      .then(() => {
        const newMemories = { ...memories };
        delete newMemories[id];
        setMemories(newMemories);
        setLoading(false);
      })
      .catch((err) => {
        setError(err?.error || "ERROR");
        setLoading(false);
      });
  }
  
  function checkForSession() {
    fetchSession()
      .then((session) => {
        setUsername(session.username);
        setUserRole(session.role || USER_ROLES.USER);
        setLoginStatus(LOGIN_STATUS.IS_LOGGED_IN);
        return fetchTrips();
      })
      .catch((err) => {
        if (err?.error === SERVER.AUTH_MISSING) {
          return Promise.reject({ error: CLIENT.NO_SESSION });
        }
        return Promise.reject(err);
      })
      .then((trips) => {
        tripDispatch({ type: "SET_TRIPS", payload: trips }); 
        setLoading(false);
      })
      .catch((err) => {
        if (err?.error === CLIENT.NO_SESSION) {
          setLoginStatus(LOGIN_STATUS.NOT_LOGGED_IN);
          return;
        }
        setError(err?.error || "ERROR");
      });
  }

  function onFetchAdminStats() {
    setLoading(true);
    return fetchAdminStats()
      .then((stats) => {
        setAdminStats(stats);
        setLoading(false);
        return stats;
      })
      .catch((err) => {
        setError(err?.error || "ERROR");
        setLoading(false);
        return Promise.reject(err);
      });
  }

  useEffect(() => {
    checkForSession();
  }, []);

  return (
    <div className="app">
      <main className="main">
        {error && <Status error={error} />}
        {registerSuccess && (
          <div className="register-success">
            Registration successful! Welcome, {username}!
          </div>
        )}
        {loginStatus === LOGIN_STATUS.PENDING && (
          <Loading>Loading user...</Loading>
        )}
        {loginStatus === LOGIN_STATUS.NOT_LOGGED_IN && (
          <AuthPage onLogin={onLogin} onRegister={onRegister} />
        )}
        {loginStatus === LOGIN_STATUS.IS_LOGGED_IN && (
          <div className="content">
            <div className="header">
              <h1>Travel Planner</h1>
              <div className="user-info">
                <p>
                  Hello, {username}{" "}
                  {userRole === USER_ROLES.ADMIN && (
                    <span className="admin-badge">Admin</span>
                  )}
                </p>
                <Controls onLogout={onLogout} onRefresh={onRefresh} />
              </div>
            </div>

            <Navigation
              viewState={viewState}
              setViewState={setViewState}
              viewHistory={viewHistory}
              setViewHistory={setViewHistory}
              userRole={userRole}
            />

            {loading && <Loading>Loading...</Loading>}

            {!loading && viewState === VIEW_STATES.TRIPS_LIST && (
              <div className="trips-container">
                <TripList
                  trips={tripState.trips}
                  onTripSelect={onTripSelect}
                  onDeleteTrip={onDeleteTrip}
                  lastAddedTripId={tripState.lastAddedTripId}
                  userRole={userRole} 
                  username={username} 
                />
                <AddTripForm onAddTrip={onAddTrip} />
              </div>
            )}

            {!loading &&
              viewState === VIEW_STATES.STATS &&
              hasPermission(userRole, PERMISSIONS.VIEW_STATS) && (
                <AdminPanel 
                  stats={adminStats} 
                  onFetchStats={onFetchAdminStats} 
                />
              )}

            {!loading &&
              viewState === VIEW_STATES.TRIP_DETAIL &&
              tripState.selectedTripId && (
                <>
                  <TripDetail
                    trip={tripState.trips[tripState.selectedTripId]}
                    onBack={onBack}
                    places={Object.values(places).filter(
                      (place) => place.tripId === tripState.selectedTripId
                    )}
                    memories={Object.values(memories).filter(
                      (memory) => memory.tripId === tripState.selectedTripId
                    )}
                    onShowAddPlaceForm={onShowAddPlaceForm}
                    onShowAddMemoryForm={onShowAddMemoryForm}
                    onDeletePlace={onDeletePlace}
                    onDeleteMemory={onDeleteMemory}
                    onUpdateTrip={onUpdateTrip}
                    userRole={userRole}
                    username={username} 
                  />

                  {showAddPlaceForm && (
                    <AddPlaceForm
                      tripId={currentTripForForm}
                      onAddPlace={onAddPlace}
                      onCancel={onHideAddPlaceForm}
                    />
                  )}
                  {showAddMemoryForm && (
                    <AddMemoryForm
                      tripId={currentTripForForm}
                      places={places}
                      onAddMemory={onAddMemory}
                      onCancel={onHideAddMemoryForm}
                    />
                  )}
                </>
              )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
