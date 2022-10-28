import { removeFromSessionStorage } from "./Storage.service.js";

export const errorMessage = (errorMessage, errorMessageContainer) => {
    errorMessageContainer.text('');
    errorMessageContainer.text(errorMessage);
    errorMessageContainer.css('display', 'block');
}

export function logout() {
    removeFromSessionStorage("user")
    window.location = "/login.html"
}

export function checkUserTokenExist(user) {
    if (!user?.token) {
        logout("noToken")
    }
}