import axios from 'axios';
const axiosInstance = axios.create({
  baseURL: 'http://192.168.29.195:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default axiosInstance;
