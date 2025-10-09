import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { toast } from "react-toastify";

// const apiUrl = import.meta.env.VITE_APP_API_URL;
const apiUrl = 'http://localhost:5005/'

// content type
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.baseURL = apiUrl;
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!navigator.onLine) {
      window.location.href = "/no-internet";
      return Promise.reject("No internet connection");
    }
    if (!error.response) {
      return Promise.reject(error.message || "An unexpected error occurred.");
    }
    const { status, data } = error.response;
    let message;

    switch (status) {
      case 400:
        message = data?.message || data?.error || "Bad Request";
        break;
      case 401:
        message = data?.message || "Unauthorized access";
        // sessionStorage.removeItem('hyper_user');
        // localStorage.clear();
        // window.location.href = '/account/login';
        break;
      case 403:
        message = data?.message || "Access Forbidden";
        // sessionStorage.removeItem('hyper_user');
        // localStorage.clear();
        // window.location.href = '/account/login';
        break;
      case 404:
        message =
          data?.message ||
          "Sorry! The data you are looking for could not be found.";
        // window.location.href = '/error-404';
        break;
      case 500:
        // window.location.href = '/error-500';
        message = data?.message;
        break;
      default:
        message =
          data?.message || error.message || "An unknown error occurred.";
    }

    return Promise.reject(message);
  }
);

const AUTH_SESSION_KEY = "fitbit_user";

/**
 * Sets the default authorization
 * @param {*} token
 */
const setAuthorization = (token) => {
  if (token) axios.defaults.headers.common["Authorization"] = "Bearer " + token;
  else delete axios.defaults.headers.common["Authorization"];
};

const getUserFromSession = () => {
  const user = sessionStorage.getItem(AUTH_SESSION_KEY);
  return user ? (typeof user == "object" ? user : JSON.parse(user)) : null;
};
class APICore {
  /**
   * Fetches data from given url
   */
  get = (url, params) => {
    let response;
    if (params) {
      var queryString = params
        ? Object.keys(params)
          .map((key) => key + "=" + params[key])
          .join("&")
        : "";
      response = axios.get(`${url}?${queryString}`, params);
    } else {
      response = axios.get(`${url}`, params);
    }
    return response;
  };

  getFile = (url, params) => {
    let response;
    if (params) {
      var queryString = params
        ? Object.keys(params)
          .map((key) => key + "=" + params[key])
          .join("&")
        : "";
      response = axios.get(`${url}?${queryString}`, { responseType: "blob" });
    } else {
      response = axios.get(`${url}`, { responseType: "blob" });
    }
    return response;
  };

  getMultiple = (urls, params) => {
    const reqs = [];
    let queryString = "";
    if (params) {
      queryString = params
        ? Object.keys(params)
          .map((key) => key + "=" + params[key])
          .join("&")
        : "";
    }

    for (const url of urls) {
      reqs.push(axios.get(`${url}?${queryString}`));
    }
    return axios.all(reqs);
  };

  /**
   * post given data to url
   */
  create = (url, data) => {
    return axios.post(url, data);
  };

  /**
   * Updates patch data
   */
  updatePatch = (url, data) => {
    return axios.patch(url, data);
  };

  /**
   * Updates data
   */
  update = (url, data) => {
    return axios.put(url, data);
  };

  /**
   * Deletes data
   */
  delete = (url) => {
    return axios.delete(url);
  };

  /**
   * post given data to url with file
   */
  createWithFile = (url, data) => {
    let formData;
    
    // If data is already FormData, use it directly
    if (data instanceof FormData) {
      formData = data;
    } else {
      // Otherwise, create FormData from object
      formData = new FormData();
      for (const k in data) {
        formData.append(k, data[k]);
      }
    }

    const config = {
      headers: {
        ...axios.defaults.headers,
        "content-type": "multipart/form-data",
      },
    };
    return axios.post(url, formData, config);
  };

  /**
   * post given data to url with file
   */
  updateWithFile = (url, data) => {
    const formData = new FormData();
    for (const k in data) {
      formData.append(k, data[k]);
    }

    const config = {
      headers: {
        ...axios.defaults.headers,
        "content-type": "multipart/form-data",
      },
    };
    return axios.patch(url, formData, config);
  };

  isUserAuthenticated = () => {
    const user = this.getLoggedInUser();
    if (!user || (user && !user.token)) {
      return false;
    }
    const decoded = jwtDecode(user.token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      console.warn("Access token expired !");
      toast.error(
        "Your session has expired. Redirecting you to the login page."
      );
      sessionStorage.removeItem(AUTH_SESSION_KEY);
      localStorage.clear();
      window.location.href = "/login";
      return false;
    } else {
      return true;
    }
  };

  setLoggedInUser = (session) => {
    if (session)
      sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
    else {
      sessionStorage.removeItem(AUTH_SESSION_KEY);
    }
  };

  /**
   * Returns the logged in user
   */
  getLoggedInUser = () => {
    return getUserFromSession();
  };

  setUserInSession = (modifiedUser) => {
    let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);
    if (userInfo) {
      const { token, user } = JSON.parse(userInfo);
      this.setLoggedInUser({ token, ...user, ...modifiedUser });
    }
  };
}

/*
Check if token available in localStorage
*/
let user = getUserFromSession();
if (user) {
  const { token } = user;
  if (token) {
    setAuthorization(token);
  }
}
// const token = localStorage.getItem('token');
// if (token) {
//     setAuthorization(token);
// }

export { APICore, setAuthorization, getUserFromSession };
