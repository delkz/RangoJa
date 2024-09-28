import axios from "axios";


export const api = axios.create({
    baseURL: 'http://localhost:4000/graphql',
    timeout: 1000,
    method: "POST"
})