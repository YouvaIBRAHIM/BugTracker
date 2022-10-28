import { signUp, login } from "./service/Api.service.js";
import { setToSessionStorage, getFromSessionStorage } from "./service/Storage.service.js";
import { errorMessage } from "./service/Utils.service.js";
const userFromSessionStorage = getFromSessionStorage("user")
if (userFromSessionStorage?.token) {
    window.location = "/src/pages/bugsList.html";
}
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const urlMessage = urlParams.get('message');
if (urlMessage && urlMessage=="wrongToken") {
    notie.alert({ type: 'warning', text: "VOTRE TOKEN N'EST PLUS VALIDE.", time: 2 })
}
if (urlMessage && urlMessage=="noToken") {
    notie.alert({ type: 'warning', text: "VOUS N'AVEZ PAS DE TOKEN VALIDE.", time: 2 })
}
const username = $("#username");
const password = $("#password");
const passwordValidation = $("#passwordValidation");
const letter = $("#letter");
const capital = $("#capital");
const number = $("#number");
const length = $("#length");
const passwordRequirements = $("#passwordRequirements");
const lowerCaseLetters = /[a-z]/g;
const upperCaseLetters = /[A-Z]/g;
const numbers = /[0-9]/g;
const loginErrorMessageContainer = $('.login .errorMessage');
const loginSuccessContainer = $('.login #successContainer');

const errorMessageContainer = $('.errorMessage');
const successContainer = $('.signUp #successContainer');
const successMessageTitle = $('.signUp #successContainer h4');

const loginContainer = $('.login');
const signUpContainer = $('.signUp');

$( window ).on( 'hashchange', function( e ) {
    loginContainer.toggleClass('hide')
    signUpContainer.toggleClass('hide')
} );

const onLogin = (event) => {
    event.preventDefault();
    const username = $("#loginUsername").val().trim();
    const password = $("#loginPassword").val().trim();

    if (username !== "" && password != "") {
        const response = login(username, password);
        response.then(res => {
            if (res.data.result.status == "done") {
                onSuccessLogin(res.data, username)
            }else{
                errorMessage(res.data.result.message, loginErrorMessageContainer);
            }
        })
        .catch(err => {
            errorMessage(err.message, loginErrorMessageContainer);
        });
    }else{
        errorMessage("Un ou plusieurs champs sont vides.", loginErrorMessageContainer);
    }
}

const onSuccessLogin = (data, usernameValue) => {
    loginErrorMessageContainer.css('display', 'none');
    loginSuccessContainer.css('display', 'block');

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

const onSignUp = (event) => {
    event.preventDefault();
    const usernameValue = username.val().trim();
    const passwordValue = password.val().trim();

    if (isValidUsername() && isValidPassword()) {
        const response = signUp(usernameValue, passwordValue);
        response.then(res => {
            if (res.status == 200) {
                onSuccessSignUp(res.data, usernameValue);
            }else{
                errorMessage(res.statusText, errorMessageContainer);
            }
        })
        .catch(err => {
            errorMessage(err.message, errorMessageContainer);
        });
    }
}


password.on("focus", function() {
    passwordRequirements.css('display', 'block');
})

password.on("blur", function() {
    passwordRequirements.css('display', 'none');
})

password.on("keyup", function() {
    // Validate lowercase letters
    if(password.val().match(lowerCaseLetters)) {
        letter.removeClass("glitched");
        letter.addClass("valid");
    } else {
        letter.removeClass("valid");
        letter.addClass("glitched");
    }

    // Validate capital letters
    if(password.val().match(upperCaseLetters)) {
        capital.removeClass("glitched");
        capital.addClass("valid");
    } else {
        capital.removeClass("valid");
        capital.addClass("glitched");
    }

    // Validate numbers
    if(password.val().match(numbers)) {
        number.removeClass("glitched");
        number.addClass("valid");
    } else {
        number.removeClass("valid");
        number.addClass("glitched");
    }

    // Validate length
    if(password.val().length >= 8) {
        length.removeClass("glitched");
        length.addClass("valid");
    } else {
        length.removeClass("valid");
        length.addClass("glitched");
    }
})

const isValidPassword = () => {
    if (password.val().trim() === "") {
        errorMessage("Le champs \"mot de passe\" est vide.", errorMessageContainer);
        return false;
    }
    if(password.val().match(lowerCaseLetters) && 
        password.val().match(upperCaseLetters) &&
        password.val().match(numbers) &&
        password.val().length >= 8
    ) {
        if (password.val() === passwordValidation.val()) {
            return true;
        }else{
            errorMessage("Vos mots de passe ne sont pas identiques.", errorMessageContainer);
            return false;
        }
    } else {
        errorMessage("Vous n'avez pas respcté le format du mot de passe.", errorMessageContainer);

        return false;
    }
}

const isValidUsername = () => {
    if(username.val().trim().length >= 3 &&
        (
            username.val().match(lowerCaseLetters) || 
            username.val().match(upperCaseLetters)
        )
    ) {
        return true;
    } else {
        errorMessage("Le nom d'utilisateur doit contenir au moins 3 lettres.", errorMessageContainer);
        return false;
    }
}

const onSuccessSignUp = (data, usernameValue) => {
    errorMessageContainer.css('display', 'none');
    successMessageTitle.text('');
    successMessageTitle.text(`Merci pour votre inscription ${usernameValue}. Vous allez être redirigé vers la page d'accueil.`);
    successContainer.css('display', 'block');

    setToSessionStorage("user", {
        userId: data.result.id,
        userName: usernameValue,
        token: data.result.token,
    })

    setTimeout(() => {
        window.location = "/src/pages/bugsList.html";
    }, 3000);
}
$(".signInBtnContainer button").on("click", onSignUp)