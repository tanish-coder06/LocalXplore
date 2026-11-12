import axios from "axios";

// Create an Axios instance to communicate with our backend
const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Automatically attach the JWT token to every API request
api.interceptors.request.use(
  (config) => {

    // Get the token saved when the user logged in
    const token = localStorage.getItem("token");

    // If a token exists, attach it to the request
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Continue with the API request
    return config;
  },

  // Handle request errors
  (error) => Promise.reject(error)
);

// Export the instance for use in other React files
export default api;
