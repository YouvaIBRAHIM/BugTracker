import { getAllBugs, getAllUsers, updateBugState, deleteBug } from "./service/Api.service.js";
import moment from "../../node_modules/moment/dist/moment.js";
import { generateHeader } from "./header.js";

//récupération du nom de la page depuis le lien
const currentPage = window.location.href.split("/").reverse()[0].split(".")[0];
generateHeader(currentPage);

const allBugs = $(".stats .all strong");
const bugsInProgress = $(".stats .inProgress strong");
const bugsDone = $(".stats .done strong");
const tableBody = $(".tableSection tbody");
const searchBug = $("#searchBug");
let bugsList = []; 
let filtredBugsList = []; 
let usersList = null;

//récupération de la liste des utilisateurs
const usersListFromApi = getAllUsers();
usersListFromApi.then((res) => {
    usersList = res.data.result.user;

    getAllUsersBugs(usersList);
})
.catch((err) => notie.alert({ type: 'error', text: err.message, time: 2 }))

/**
 * récupération des bugs
 * @param {Array} users liste des utilisateurs
 */
function getAllUsersBugs(users) {
    
    // Selon la page actuelle (bugsList ou myBugs) on récupère soit tous les bugs ou seulement ceux de l'utilisateur
    const bugs = getAllBugs(currentPage == "bugsList" ? "0" : null);
        bugs.then(bugsRes => {
            if (bugsRes.data.result.status == "done") {
                const userBugs = bugsRes.data.result.bug.reverse();

                if (userBugs.length > 0) {
                    if (currentPage == "myBugs") {
                        // récupère seulement les bugs à traiter
                        bugsList = userBugs.filter(bug => bug.state == 0);
                    }else{
                        bugsList = [...bugsList, ...userBugs] 
                    }
                }
                displayBugsList(bugsList, users);
                
            }else{
                notie.alert({ type: 'warning', text: bugsRes.statusText.toUpperCase(), time: 2 })
            }
    })
    .catch((bugsErr) => notie.alert({ type: 'error', text: bugsErr.message, time: 2 }))
}

/**
 * génére la liste des bugs dans le corps de la balise Table
 * @param {*} bugsList  liste des bugs
 * @param {*} usersList  liste des utilisateurs
 */
function displayBugsList(bugsList, usersList) {
    tableBody.html("");
    allBugs.text(bugsList.length);

    let bugsInProgressNb = 0;
    let bugsDoneNb = 0;
    if (bugsList !== null && bugsList.length > 0 && usersList !== null && usersList.length > 0 ) {
        
        for (let i = 0; i < bugsList.length; i++) {
            const bug = bugsList[i];
            // calcule le nombre de bugs en cours et traités
            if (bug.state == 2) {
                bugsDoneNb++;
            }else if(bug.state == 1){
                bugsInProgressNb++;
            }
            
            tableBody.append(`
                <tr data-bug-id="${bug?.id}">
                    <td class="bugColumn" data-title="Bug" colspan="2">
                        <h3  class="cyberpunk">
                            ${bug?.title}
                        </h3>
                        <p class="cyberpunk scannedh">
                            ${bug?.description}
                        </p>
                    </td>
                    <td data-title="Date">
                        ${moment.unix(bug?.timestamp).format("DD/MM/YYYY HH:mm:ss")}
                    </td>
                    <td data-title="Nom">
                        ${usersList[bug?.user_id]}
                    </td>
                    <td data-title="État">
                        <div class="select" data-bug-id="${bug?.id}" tabIndex="1">
                          <input class="selectopt" name="state${bug?.id}" type="radio" id="todo${bug?.id}" ${bug?.state == 0 ? "checked" : ""} value="0"/>
                          <label for="todo${bug?.id}" style="background: #ff003c;" class="stateSelect option">À traiter</label>
  
                          <input class="selectopt" name="state${bug?.id}" type="radio" id="inProgress${bug?.id}"  ${bug?.state == 1 ? "checked" : ""} value="1"/>
                          <label for="inProgress${bug?.id}" style="background: #ff9800;" class="stateSelect option ">En cours</label> 

                          <input class="selectopt" name="state${bug?.id}" type="radio" id="done${bug?.id}" ${bug?.state == 2 ? "checked" : ""} value="2"/>
                          <label for="done${bug?.id}" style="background: #8ae66e;" class="stateSelect option ">Traité</label>
                      </div>
                    </td>
                    <td class="deleteBtnContainer">
                        <a>Supprimer</a>
                    </td>
                </tr>
            `)
        }
    }
    bugsInProgress.text(bugsInProgressNb)
    bugsDone.text(bugsDoneNb)
    if (bugsList.length > 0) {
        pagination() 
    }
}

// au changement d'état d'un bug
tableBody.on("change", ".select", function(event) {
    const bugId = event.target.closest('tr').dataset.bugId;
    const newState = event.target.value;
    
    updateBugState(bugId, newState)
    .then(res => {
        if (res.status == 200) {
            notie.alert({ type: 'success', text: 'ÉTAT DU BUG À JOUR', time: 2 })
            if (currentPage == "myBugs" && newState > 0) {
                bugsList = bugsList.filter(bug => bug.id !== bugId);
                displayBugsList(bugsList, usersList)
            }

        }else{
            notie.alert({ type: 'warning', text: res.statusText.toUpperCase(), time: 2 })
        }
    })
    .catch(err =>{
        notie.alert({ type: 'error', text: err.message, time: 2 })
    })
})

// au clic du bouton "supprimer"
tableBody.on("click", ".deleteBtnContainer a", function(event) {
    event.preventDefault();
    const bugId = event.target.closest('tr').dataset.bugId;
    const bug = bugsList.find(bug => bug.id == bugId);

    // demande une confirmation
    notie.confirm({ text: `Voulez-vous vraiment supprimer ce bug ? <br> <strong>( ${bug.title} )</strong>`, submitText: "CONFIRMER", cancelText: "ANNULER" }, function() {
        deleteBug(bugId)
        .then(res =>{
            if (res.data.result.status == "done") {
                notie.alert({ type: 'success', text: 'BUG SUPPRIMÉ'})
                bugsList = bugsList.filter(bug => bug.id !== bugId);
                displayBugsList(bugsList, usersList)
            }else{
                notie.alert({ type: 'warning', text: res.statusText.toUpperCase(), time: 2 })
            }

        })
        .catch(err=> {
            notie.alert({ type: 'error', text: err.message, time: 2 })
        })
 
    })

})

// à la saisie d'un caractère dans la barre de recherche
searchBug.on("keyup", function (event) {
    const searchValue = event.target.value;

    if (searchValue.trim() == "") {
        return displayBugsList(bugsList, usersList)
    }

    filtredBugsList = bugsList.filter((bug) => {
        const bugTitle = bug.title.toLowerCase();
        const bugDescription = bug.description.toLowerCase();
        const date = moment.unix(bug?.timestamp).format("DD/MM/YYYY HH:mm:ss");
        const user = usersList[bug.user_id].toLowerCase();

        // si la chaine de caracère saisie correspond avec l'un de ces éléments :
        // * le titre du bug
        // * la description du bug
        // * la date création
        // * le nom du développeur
        // alors on récupère le bug pour l'afficher
        if (bugTitle.includes(searchValue.toLowerCase()) ||
            bugDescription.includes(searchValue.toLowerCase()) ||
            date.includes(searchValue.toLowerCase()) ||
            user.includes(searchValue.toLowerCase())
        ) {
            return bug;
        }
    });

    displayBugsList(filtredBugsList, usersList)
})


// génére la pagination
function pagination() {
    const items = $("tbody tr");
    const numItems = items.length;
    const perPage = 10;

    items.slice(perPage).hide();

    $('#pagination').pagination({
        items: numItems,
        itemsOnPage: perPage,
        prevText: "&laquo;",
        nextText: "&raquo;",
        onPageClick: function (pageNumber) {
            const showFrom = perPage * (pageNumber - 1);
            const showTo = showFrom + perPage;
            items.hide().slice(showFrom, showTo).show();
        }
    });
}