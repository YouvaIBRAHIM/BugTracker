import { getAllBugs, getAllUsers, updateBugState, deleteBug } from "./service/Api.service.js";

import moment from "../../node_modules/moment/dist/moment.js";

const tableBody = $(".tableSection tbody");
const searchBug = $("#searchBug");

let bugsList = []; 
let filtredBugsList = []; 
let usersList = null;
const usersListFromApi = getAllUsers();
usersListFromApi.then((res) => {
    usersList = res.data.result.user;

    getAllUsersBugs(usersList);
})
.catch((err) => console.log(err))

function getAllUsersBugs(users) {
    
    const bugs = getAllBugs("0");
        bugs.then(bugsRes => {
        const userBugs = bugsRes.data.result.bug;

        if (userBugs.length > 0) {
            bugsList = [...bugsList, ...userBugs] 
        }
        displayBugsList(bugsList, users);
    })
    .catch((bugsErr) => console.log(bugsErr))
}

function displayBugsList(bugsList, usersList) {
    tableBody.html("");
    if (bugsList !== null && bugsList.length > 0 && usersList !== null && usersList.length > 0 ) {
        bugsList.reverse();
        for (let i = 0; i < bugsList.length; i++) {
            const bug = bugsList[i];

            tableBody.append(`
                <tr data-bug-id="${bug?.id}">
                    <td data-title="Bug" colspan="2">
                    <h3  class="cyberpunk">
                        ${bug?.title}
                    </h3>
                    <p>
                        ${bug?.description}
                    </p>
                    </td>
                    <td data-title="Date">
                        ${moment.unix(bug?.timestamp).format("DD/MM/YYYY")}
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
                          <label for="done${bug?.id}" style="background: #8ae66e;" class="stateSelect option ">Fait</label>
                      </div>
                    </td>
                    <td class="deleteBtnContainer">
                        <a>Supprimer</a>
                    </td>
                </tr>
            `)
        }
    }
}

tableBody.on("change", ".select", function(event) {
    const bugId = event.target.closest('tr').dataset.bugId;
    const newState = event.target.value;
    
    updateBugState(bugId, newState)
    .then(res => {
        if (res.status == 200) {
            notie.alert({ type: 'success', text: 'ÉTAT DU BUG À JOUR', time: 2 })

        }else{
            notie.alert({ type: 'warning', text: res.statusText.toUpperCase(), time: 2 })
        }
    })
    .catch(err =>{
        notie.alert({ type: 'error', text: err.message, time: 2 })
    })
})

tableBody.on("click", ".deleteBtnContainer a", function(event) {
    event.preventDefault();
    const bugId = event.target.closest('tr').dataset.bugId;

    const bug = bugsList.find(bug => bug.id == bugId);
    notie.confirm({ text: `Voulez-vous vraiment supprimer ce bug ? <br> <strong>( ${bug.title} )</strong>`, submitText: "CONFIRMER", cancelText: "ANNULER" }, function() {
        deleteBug(bugId)
        .then(res =>{
            if (res.status == 200) {
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

searchBug.on("keyup", function (event) {
    const searchValue = event.target.value;

    if (searchValue.trim() == "") {
        return displayBugsList(bugsList, usersList)
    }

    filtredBugsList = bugsList.filter((bug) => {
        const bugTitle = bug.title;
        const bugDescription = bug.description;
        if (bugTitle.includes(searchValue.toLowerCase())) {
            return bug;
        }
        if (bugDescription.includes(searchValue.toLowerCase())) {
            return bug;
        }

    });

    displayBugsList(filtredBugsList, usersList)
})