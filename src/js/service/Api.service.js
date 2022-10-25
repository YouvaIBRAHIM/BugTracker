import "../../../node_modules/axios/dist/axios.min.js";
import { getFromSessionStorage } from "./Storage.service.js";

const baseURL = "http://greenvelvet.alwaysdata.net/bugTracker/api/";
// initialisation d'une instance axios
const instance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});



export async function login(username, password) {
  const loginApi = `login/${username}/${password}`;  
  
  try {
    const response = await instance.get(loginApi)
    return response;
  } catch (error) {
    return error.response;
  }
}



export async function signUp(username, password) {
  const signUpApi = `signup/${username}/${password}`;  
  
  try {
    const response = await instance.get(signUpApi)
    return response;
  } catch (error) {
    return error.response;
  }
}
