import { login } from "./service/Api.service.js";
import { setToSessionStorage } from "./service/Storage.service.js";
import { errorMessage } from "./service/Utils.service.js";

const successContainer = $('#successContainer');
const errorMessageContainer = $('.errorMessage');


const onLogin = (event) => {
    event.preventDefault();
    const username = $("#username").val().trim();
    const password = $("#password").val().trim();

    if (username !== "" && password != "") {
        const response = login(username, password);
        response.then(res => {
            if (res.data.result.status == "done") {
                onSuccessLogin(res.data, username)
            }else{
                errorMessage(res.data.result.message, errorMessageContainer);
            }
        })
        .catch(err => {
            errorMessage(err.message, errorMessageContainer);
        });
    }else{
        errorMessage("Un ou plusieurs champs sont vides.", errorMessageContainer);
    }
}

const onSuccessLogin = (data, usernameValue) => {
    errorMessageContainer.css('display', 'none');
    successContainer.css('display', 'block');

    setToSessionStorage("user", {
        userId: data.result.id,
        userName: usernameValue,
        token: data.result.token,
    })

    setTimeout(() => {
        window.location = "/src/pages/bugsList.html";
    }, 2000);
}

$(".loginBtnContainer button").on("click", onLogin)