import { generateHeader } from "./header.js";
import { addBug } from "./service/Api.service.js";

const currentPage = "newBug";
generateHeader(currentPage);

const newBugForm = $("#newBugForm");

newBugForm.on("submit", function(event) {
    event.preventDefault();
    const bugTitle = $("#bugTitle");
    const bugDescription = $("#bugDescription");

    const bugTitleValue = bugTitle.val().trim();
    const bugDescriptionValue = bugDescription.val().trim();

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