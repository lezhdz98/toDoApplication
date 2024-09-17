// Importing Axios, a library for making HTTP requests
import axios from 'axios';

// Creating a custom instance of Axios with specific configuration
const axiosInstance = axios.create({
  // baseURL: The base URL for all HTTP requests
  // This allows all requests to use this URL as a prefix
  baseURL: 'http://localhost:9090/api/v1', 

  // timeout: The maximum time in milliseconds to wait for a response
  // If the request takes longer than this time, it will be automatically canceled
  timeout: 1000, // 1000 milliseconds = 1 second

  // headers: Custom HTTP headers to be sent with each request
  // Here, the content type is set to JSON
  headers: {'Content-Type': 'application/json'}
});

// Exporting the Axios instance so it can be used in other files
export default axiosInstance;
