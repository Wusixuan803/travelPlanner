export const LOGIN_STATUS = {
  PENDING: "pending",
  NOT_LOGGED_IN: "notLoggedIn",
  IS_LOGGED_IN: "loggedIn",
};

export const VIEW_STATES = {
  TRIPS_LIST: "tripsList",
  TRIP_DETAIL: "tripDetail",
  PLACE_DETAIL: "placeDetail",
  STATS: "stats", 
};

export const SERVER = {
  AUTH_MISSING: "auth-missing",
  AUTH_INSUFFICIENT: "auth-insufficient",
  REQUIRED_USERNAME: "required-username",
  REQUIRED_TITLE: "required-title",
  REQUIRED_NAME: "required-name",
  USER_NOT_FOUND: "user-not-found", 
};

export const CLIENT = {
  NETWORK_ERROR: "networkError",
  NO_SESSION: "noSession",
};

export const MESSAGES = {
  [CLIENT.NETWORK_ERROR]: "Trouble connecting to the network. Please try again",
  [SERVER.AUTH_INSUFFICIENT]: "This username is not allowed. Please choose another username",
  [SERVER.REQUIRED_USERNAME]: "Please enter a valid (letters and/or numbers) username",
  [SERVER.REQUIRED_TITLE]: "Please enter a title",
  [SERVER.REQUIRED_NAME]: "Please enter a name",
  [SERVER.USER_NOT_FOUND]: "User does not exist. Please sign up first.", 
  default: "Something went wrong. Please try again",
};

export const TRIP_CATEGORIES = [
  'Beach',
  'City',
  'Mountain',
  'Adventure',
  'Culture'
];

export const ITEMS_PER_PAGE = 5;
