import { removeFromSessionStorage } from "./Storage.service.js";

export const errorMessage = (errorMessage, errorMessageContainer) => {
    errorMessageContainer.text('');
    errorMessageContainer.text(errorMessage);
    errorMessageContainer.css('display', 'block');
}

export function logout(urlParam = null) {
    removeFromSessionStorage("user")
    if (!urlParam) {
        window.location = "/index.html"
    }else{
        window.location = `/index.html?message=${urlParam}`
    }
}

export function checkUserTokenExist(user) {
    if (!user?.token) {
        logout("noToken")
    }
}