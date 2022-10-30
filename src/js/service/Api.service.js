import "../../../node_modules/axios/dist/axios.min.js";
import { getFromSessionStorage } from "./Storage.service.js";
import { checkUserTokenExist, logout } from "./Utils.service.js";

const baseURL = "http://greenvelvet.alwaysdata.net/bugTracker/api/";
// initialisation d'une instance axios
const instance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "text/plain",
  },
});

/**
 * execute une requete de type GET
 * @param {String} path lien de l'API
 * @returns retourne la réponse de la requete
 */
async function getFromBugTrackerApi(path) {
  try {
    const response = await instance.get(path)
    // Si la reponse de la requete indique que le token n'est pas valide, l'utilisateur est redirigé vers la page de connexion
    if (response.data.result?.message == "wrong token. Access denied") {
      logout("wrongToken");
    }
    return response;
  } catch (error) {
    return error.response;
  }
}

/**
 * execute une requete de type POST
 * @param {String} path lien de l'API
 * @param {String} data Données à poster
 * @returns retourne la réponse de la requete
 */
async function postToBugTrackerApi(path, data) {
  try {
    const response = await instance.post(path, data)
    if (response.data.result?.message == "wrong token. Access denied") {
      logout("wrongToken");
    }
    return response;
  } catch (error) {
    return error.response;
  }
}

/**
 * lance la requete pour se connecter
 * @param {String} username nom de l'utilisateur
 * @param {String} password son mot de passe
 * @returns retourne la réponse de la requete
 */
export async function login(username, password) {
  const loginApi = `login/${username}/${password}`;  
  
  return getFromBugTrackerApi(loginApi);
}

/**
 * lance la requete pour se déconnecter
 * @returns retourne la réponse de la requete
 */
export async function logoutFromApi() {
  const user = getFromSessionStorage("user");
  checkUserTokenExist(user);
  const logoutApi = `logout/${user?.token}`;  
  
  return getFromBugTrackerApi(logoutApi);
}

/**
 * lance la requete pour s'inscrire
 * @param {String} username nom de l'utilisateur
 * @param {String} password son mot de passe
 * @returns retourne la réponse de la requete
 */
export async function signUp(username, password) {
  const signUpApi = `signup/${username}/${password}`;  

  return getFromBugTrackerApi(signUpApi);
}

/**
 * 
 * @returns retourne la liste des utilisteurs
 */
export async function getAllUsers() {
  const user = getFromSessionStorage("user");
  checkUserTokenExist(user);
  const usersListApi = `users/${user?.token}`;  
  
  return getFromBugTrackerApi(usersListApi);
}

/**
 * Si le paramètre n'est pas fourni, on récupère par défaut les bugs de l'utilisateur connecté
 * @param {Number} userId id de l'utilisateur dont on souhaite récuèrer les bugs
 * @returns  retourne la liste des bugs
 */
export async function getAllBugs(userId = null) {
  const user = getFromSessionStorage("user");
  checkUserTokenExist(user);
  const bugsListApi = `list/${user?.token}/${userId ? userId : user.userId}`;  
  
  return getFromBugTrackerApi(bugsListApi);
}

/**
 * met à jour le nouvel état du bug
 * @param {Number} bugId id du bug
 * @param {Number} state nouvel etat du bug
 * @returns retourne la réponse de la requete
 */
export async function updateBugState(bugId, state) {
  const user = getFromSessionStorage("user");
  checkUserTokenExist(user);
  const updateBugStateApi = `state/${user?.token}/${bugId}/${state}`;  
  
  return getFromBugTrackerApi(updateBugStateApi);
}


/**
 * supprime un bug
 * @param {Number} bugId id du bug
 * @returns retourne la réponse de la requete
 */
export async function deleteBug(bugId) {
  const user = getFromSessionStorage("user");
  checkUserTokenExist(user)
  const deleteApi = `delete/${user?.token}/${bugId}`;  
  
  return getFromBugTrackerApi(deleteApi);
}

/**
 * Ajoute un nouveau bug
 * @param {String} data objet converti en chaine de caractère contenant le titre et la description du nouveau bug
 * @returns retourne la réponse de la requete
 */
export async function addBug(data) {
  const user = getFromSessionStorage("user");
  checkUserTokenExist(user)
  const addApi = `add/${user?.token}/${user.userId}`;  
  
  return postToBugTrackerApi(addApi, data);
}