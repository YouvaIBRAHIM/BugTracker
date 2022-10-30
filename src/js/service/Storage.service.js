/**
 * 
 * @param {String} key 
 * @returns recupère du SessionStorage la clé saisi
 */
export function getFromSessionStorage(key) {
    const data = JSON.parse(sessionStorage.getItem(key));
    return data;
}

/**
 * 
 * @param {String} key clé de stockage
 * @param {String} data valeur à stocker dans le SessionStorage
 */
export function setToSessionStorage(key, data) {
    sessionStorage.setItem(key, JSON.stringify(data));
}

/**
 * 
 * @param {String} key 
 * @returns supprime du SessionStorage la clé saisi
 */
 export function removeFromSessionStorage(key) {
    sessionStorage.removeItem(key);
}

