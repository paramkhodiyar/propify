import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_MODE === 'DEVELOPEMENT' ? 'http://localhost:4000/api' : 'https://propify-g2n5.onrender.com/api',
    withCredentials: true,
});

export default api;
