import "../../../node_modules/axios/dist/axios.min.js";
import { getFromSessionStorage } from "./Storage.service.js";
const user = getFromSessionStorage("user");

const baseURL = "http://greenvelvet.alwaysdata.net/bugTracker/api/";
// initialisation d'une instance axios
const instance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

async function getFromBugTrackerApi(path) {
  try {
    const response = await instance.get(path)
    return response;
  } catch (error) {
    return error.response;
  }
}

export async function login(username, password) {
  const loginApi = `login/${username}/${password}`;  
  
  return getFromBugTrackerApi(loginApi);
}

export async function signUp(username, password) {
  const signUpApi = `signup/${username}/${password}`;  

  return getFromBugTrackerApi(signUpApi);
}


export async function getAllUsers() {
  const usersListApi = `users/${user.token}`;  
  
  return getFromBugTrackerApi(usersListApi);
}

export async function getAllBugs(userId = null) {
  const bugsListApi = `list/${user.token}/${userId ? userId : user.userId}`;  
  
  return getFromBugTrackerApi(bugsListApi);
}