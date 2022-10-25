import { getAllBugs, getAllUsers } from "./service/Api.service.js";
import { getFromLocalStorage, setToLocalStorage } from "./service/Storage.service.js";
import  moment from "../../node_modules/moment/dist/moment.js";

const bugsListFromLocalStorage = getFromLocalStorage('bugsList');
const usersListFromLocalStorage = getFromLocalStorage('usersList');
const tableBody = $(".tableSection tbody");

displayBugsList(bugsListFromLocalStorage, usersListFromLocalStorage);
let bugsList = []; 
const usersList = getAllUsers();
usersList.then((res) => {
    const users = res.data.result.user;
    if (JSON.stringify(users) !== JSON.stringify(usersListFromLocalStorage)) {
        setToLocalStorage('usersList', users)
    }
    getAllUsersBugs(users);
})
.catch((err) => console.log(err))

function getAllUsersBugs(users) {
    
    for (let i = 0; i < users.length; i++) {
        const bugs = getAllBugs(i);
        bugs.then(bugsRes => {
            const userBugs = bugsRes.data.result.bug;
            if (userBugs.length > 0) {
                bugsList = [...bugsList, ...userBugs] 
            }
            if (i + 1 === users.length) {
                if (JSON.stringify(bugsList) !== JSON.stringify(bugsListFromLocalStorage)) {
                    displayBugsList(bugsList, users);
                    setToLocalStorage('bugsList', bugsList)
                }
            }
        })
        .catch((bugsErr) => console.log(bugsErr))
    }
}

function displayBugsList(bugsList, usersList) {
    if (bugsList !== null && bugsList.length > 0 && usersList !== null && usersList.length > 0 ) {
        for (let i = 0; i < bugsList.length; i++) {
            const bug = bugsList[i];
            tableBody.append(`
                <tr>
                    <td data-title="Bug" colspan="2">
                    <h3>
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
                        ${bug?.state}
                    </td>
                    <td class="deleteBtnContainer">
                    <a href="#">
                        Supprimer
                    </a>
                    </td>
                </tr>
            `)
        }
    }
}