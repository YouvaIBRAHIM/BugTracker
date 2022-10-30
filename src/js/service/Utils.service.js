import { removeFromSessionStorage } from "./Storage.service.js";

// affiche un message d'erreur sur la page index
export const errorMessage = (errorMessage, errorMessageContainer) => {
    errorMessageContainer.text('');
    errorMessageContainer.text(errorMessage);
    errorMessageContainer.css('display', 'block');
}

/**
 * lors de la déconnexion, les données dans le session storage sont supprimées et l'utilisateur est redirigé vers la page de connexion
 * @param {String} message si le paramètre est saisi, l'utilisateur est alerté de la raison de sa redirection
 */
export function logout(message = null) {
    removeFromSessionStorage("user")
    if (!message) {
        window.location = "/index.html"
    }else{
        window.location = `/index.html?message=${message}`
    }
}

/**
 * verifie si un token est stocké dans le session storage. Si ce n'est pas le cas, l'utilisateur esr redirigé vers la page de connexion
 * @param {Object} user données de l'utilisateur stockées dans le session storage
 */
export function checkUserTokenExist(user) {
    if (!user?.token) {
        logout("noToken")
    }
}