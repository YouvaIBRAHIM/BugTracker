import { logoutFromApi } from "./service/Api.service.js";
import { logout } from "./service/Utils.service.js";


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
        logoutFromApi()
        .then(res =>{
            if (res.data.result.status == "done") {
                logout()
            }else{
                notie.alert({ type: 'warning', text: res.statusText.toUpperCase(), time: 2 })
            }

        })
        .catch(err=> {
            notie.alert({ type: 'error', text: err.message, time: 2 })
        })
 
    })
})