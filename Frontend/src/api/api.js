import axios from "axios"

const fallbackUrl = 'http://127.0.0.1:8000';
const baseUrl = import.meta.env.VITE_API_URL ?? fallbackUrl;

const API = axios.create({
    baseURL: baseUrl,
});

export default API;