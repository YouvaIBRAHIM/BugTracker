import { signUp, login } from "./service/Api.service.js";
import { setToSessionStorage, getFromSessionStorage } from "./service/Storage.service.js";
import { errorMessage } from "./service/Utils.service.js";
const userFromSessionStorage = getFromSessionStorage("user");
// Si un token est déjà enregistré, l'utilisateur est rediriggé vers la page de la liste des bugs. S'il n'est pas valide, le token sera supprimé du sessionStorage et l'utilisateur sera renvoyé vers la page de connexion.
if (userFromSessionStorage?.token) {
    window.location = "/src/pages/bugsList.html";
}

// s'il y a un paramètre message dans le lien, cela signifie que l'utilisateur a été déconnecté ou qu'il a essayé d'accéder aux pages privées sans s'authentifier. Il sera alors alerté avec une notification
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

// au clic, affiche soit le formulaire de connexion soit d'inscription
$(".signUpBtn , .loginBtn").on( 'click', function(event) {
    event.preventDefault()
    loginContainer.toggleClass('hide')
    signUpContainer.toggleClass('hide')
} );

// s'enclenche au clic du bouton "se connecter"
const onLogin = (event) => {
    event.preventDefault();
    const username = $("#loginUsername").val().trim();
    const password = $("#loginPassword").val().trim();

    // verifie si les champs ne sont pas vides
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

/**
 * s'enclenche quand l'utilisateur arrive à s'authentifier
 * @param {Object} data données renvoyées par l'Api
 * @param {String} usernameValue Le nom de l'utilisateur
 */
const onSuccessLogin = (data, usernameValue) => {
    loginErrorMessageContainer.css('display', 'none');
    // affiche un message indiquant que l'utilisateur a reussi à s'identifier
    loginSuccessContainer.css('display', 'block');

    // enregistre les informations dans le sessionStorage
    setToSessionStorage("user", {
        userId: data.result.id,
        userName: usernameValue,
        token: data.result.token,
    })

    // redirige vers la page de la liste des bugs
    setTimeout(() => {
        window.location = "/src/pages/bugsList.html";
    }, 2000);
}

$(".loginBtnContainer button").on("click", onLogin)


// s'enclenche au clic du bouton "s'inscrire'"
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

// affiche les indications
password.on("focus", function() {
    passwordRequirements.css('display', 'block');
})

//cache les indications
password.on("blur", function() {
    passwordRequirements.css('display', 'none');
})

// à la saisie du champs "mot de passe"
password.on("keyup", function() {
    // valide la lettre miniscule
    if(password.val().match(lowerCaseLetters)) {
        letter.removeClass("glitched");
        letter.addClass("valid");
    } else {
        letter.removeClass("valid");
        letter.addClass("glitched");
    }

    // valide la lettre majuscule
    if(password.val().match(upperCaseLetters)) {
        capital.removeClass("glitched");
        capital.addClass("valid");
    } else {
        capital.removeClass("valid");
        capital.addClass("glitched");
    }

    // valide le chiffre
    if(password.val().match(numbers)) {
        number.removeClass("glitched");
        number.addClass("valid");
    } else {
        number.removeClass("valid");
        number.addClass("glitched");
    }

    // valide la longueur
    if(password.val().length >= 8) {
        length.removeClass("glitched");
        length.addClass("valid");
    } else {
        length.removeClass("valid");
        length.addClass("glitched");
    }
})

// verifie si les mots de passe saisis respectent le bon format et qu'ils sont identiques
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

// verifie si le nom de l'utilisateur contient au moins 3 lettres et ne possède pas caracères spéciaux
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


/**
 * s'enclenche quand l'utilisateur arrive à s'inscrire
 * @param {Object} data données renvoyées par l'Api
 * @param {String} usernameValue Le nom de l'utilisateur
 */
const onSuccessSignUp = (data, usernameValue) => {
    errorMessageContainer.css('display', 'none');
    successMessageTitle.text('');
    successMessageTitle.text(`Merci pour votre inscription ${usernameValue}. Vous allez être redirigé vers la page d'accueil.`);
    successContainer.css('display', 'block');

    // enregistre les informations dans le sessionStorage
    setToSessionStorage("user", {
        userId: data.result.id,
        userName: usernameValue,
        token: data.result.token,
    })

    // redirige vers la page de la liste des bugs
    setTimeout(() => {
        window.location = "/src/pages/bugsList.html";
    }, 3000);
}
$(".signInBtnContainer button").on("click", onSignUp)