import { logout } from "./service/Api.service.js";
import { removeFromSessionStorage } from "./service/Storage.service.js";

const logoutBtn = $("header .logout a");
const menuArrow = $("header .arrowMenu")

menuArrow.on('click', function() {
    $("header .arrowMenu img").toggleClass("open")
    $("header nav").toggleClass("open")
    $("header nav ul").toggleClass("open")
})

logoutBtn.on("click", function(event) {
    event.preventDefault();
    notie.confirm({ text: `Souhaitez-vous vous déconnecter ?`, submitText: "CONFIRMER", cancelText: "ANNULER" }, function() {
        logout()
        .then(res =>{
            if (res.data.result.status == "done") {
                removeFromSessionStorage("user")
                window.location = "/login.html"
            }else{
                notie.alert({ type: 'warning', text: res.statusText.toUpperCase(), time: 2 })
            }

        })
        .catch(err=> {
            notie.alert({ type: 'error', text: err.message, time: 2 })
        })
 
    })
})