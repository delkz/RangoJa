import axios from "axios";

const API_URL = process.env["API_URL"] || "http://localhost:4000/graphql/";
export const api = axios.create({
    baseURL: API_URL,
    timeout: 1000,
    method: "POST"
})