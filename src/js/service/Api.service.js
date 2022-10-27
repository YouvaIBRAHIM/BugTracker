import "../../../node_modules/axios/dist/axios.min.js";
import { getFromSessionStorage } from "./Storage.service.js";
const user = getFromSessionStorage("user");

const baseURL = "http://greenvelvet.alwaysdata.net/bugTracker/api/";
// initialisation d'une instance axios
const instance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "text/plain",
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


async function postToBugTrackerApi(path, data) {
  try {
    const response = await instance.post(path, data)
    return response;
  } catch (error) {
    return error.response;
  }
}

export async function login(username, password) {
  const loginApi = `login/${username}/${password}`;  
  
  return getFromBugTrackerApi(loginApi);
}

export async function logout() {
  const logoutApi = `logout/${user.token}`;  
  
  return getFromBugTrackerApi(logoutApi);
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

export async function updateBugState(bugId, state) {
  const updateBugStateApi = `state/${user.token}/${bugId}/${state}`;  
  
  return getFromBugTrackerApi(updateBugStateApi);
}


export async function deleteBug(bugId) {
  const deleteApi = `delete/${user.token}/${bugId}`;  
  
  return getFromBugTrackerApi(deleteApi);
}


export async function addBug(data) {
  const addApi = `add/${user.token}/${user.userId}`;  
  
  return postToBugTrackerApi(addApi, data);
}