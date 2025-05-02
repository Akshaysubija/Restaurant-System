// src/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://mern-restaurant.onrender.com/api', // 👈 Use your deployed backend URL
  withCredentials: true,
});

export default instance;
