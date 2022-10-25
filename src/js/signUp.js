import { signUp } from "./service/Api.service.js";
import { setToSessionStorage } from "./service/Storage.service.js";
import { errorMessage } from "./service/Utils.service.js";

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
const errorMessageContainer = $('.errorMessage');
const successContainer = $('#successContainer');
const successMessageTitle = $('#successContainer h4');

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


// When the user clicks on the password field, show the message box
password.on("focus", function() {
    passwordRequirements.css('display', 'block');
})


// When the user clicks outside of the password field, hide the message box
password.on("blur", function() {
    passwordRequirements.css('display', 'none');
})

// When the user starts to type something inside the password field
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