import { generateHeader } from "./header.js";
import { addBug, getAllBugs } from "./service/Api.service.js";
import { getFromSessionStorage } from "./service/Storage.service.js";
import { logout } from "./service/Utils.service.js";

const user = getFromSessionStorage("user");
// Si le token n'est pas présent, l'utilisateur est renvoyé vers la page de connexion
if (!user?.token) {
    logout("noToken");
}else{
    // Si le token existe, on vérifie s'il est valide en récupérant les bugs assignés à l'utilisateur. Si ce n'est pas le cas l'utilisateur est renvoyé vers la page de connexion
    getAllBugs()
}

const currentPage = "newBug";
generateHeader(currentPage);

const newBugForm = $("#newBugForm");

// à la soumission du formulaire
newBugForm.on("submit", function(event) {
    event.preventDefault();
    const bugTitle = $("#bugTitle");
    const bugDescription = $("#bugDescription");

    const bugTitleValue = bugTitle.val().trim();
    const bugDescriptionValue = bugDescription.val().trim();

    // vérifie si les champs ne sont pas vides
    if (bugTitleValue !== "" && bugDescriptionValue !== "") {
        const newBug = {
            title: bugTitleValue,
            description: bugDescriptionValue
        }

        addBug(JSON.stringify(newBug))
        .then(res => {
            console.log(res);
            if (res.status == 200) {
                notie.alert({ type: 'success', text: 'NOUVEAU BUG AJOUTÉ.', time: 2 })
    
                bugTitle.val("");
                bugDescription.val("");
            }else{
                notie.alert({ type: 'warning', text: res.statusText.toUpperCase(), time: 2 })
            }
        })
        .catch(err =>{
            notie.alert({ type: 'error', text: err.message, time: 2 })
        })
    }else{
        notie.alert({ type: 'warning', text: "UN OU PLUSIEURS CHAMPS SONT VIDES.", time: 2 })
    }
})