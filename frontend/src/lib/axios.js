/*Axios is a HTTP client. It's a tool to send requests (like asking for data) or send data to
 any web service, whether it's a backend server or even a third-party API. */

import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api",
    withCredentials: true,
});