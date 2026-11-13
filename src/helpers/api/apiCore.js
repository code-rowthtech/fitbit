// Compatibility helpers for the public UI; no credentials or requests are used.
const setAuthorization = () => {};
const getUserFromSession = () => null;

class APICore {
  getLoggedInUser = () => null;
  isUserAuthenticated = () => false;
}

export { APICore, setAuthorization, getUserFromSession };
