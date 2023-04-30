import { getUserDeets } from "./user.js";
import { DEF_IMAGE } from "./config.js";
import { getWatchButton } from "./profile.js";

/*
Creates a card for the suggested users
*/
export function createSimilarUsers(usersWatchees, profileId) {
    const element = document.getElementById("userList");
    const usersList = document.createElement("div");
    usersList.textContent = "You may know..."
    usersList.id = profileId.toString();
    usersList.style.cssText = `
        right: clamp(0rem, -44.41rem + 48.206vw, 13.438rem);
        text-align: center;
        font-size: 18pt;
    `
    usersList.classList.add('sideCard');
    usersList.classList.add('suggestedCard');
    element.appendChild(usersList);
    let listedUsers = [];
    for (let Id in usersWatchees) {
        if (listedUsers.length >= 10) {
            return;
        }
        getUserDeets(usersWatchees[Id]).then(response => {
            if (!response.watcheeUserIds.includes(profileId) && !listedUsers.includes(response.id)) {
                makeSuggestedUser(usersList, response);  
                listedUsers.push(response.id);
            }
            let watcheeWatcheeList = response.watcheeUserIds;
            for (let id2 in watcheeWatcheeList) {
                if (listedUsers.length >= 10) {
                    return;
                }
                if ((watcheeWatcheeList[id2] != profileId)) {
                    getUserDeets(watcheeWatcheeList[id2]).then(response1 => {
                        if (!response1.watcheeUserIds.includes(profileId) && !listedUsers.includes(response1.id)) {
                            makeSuggestedUser(usersList, response1);
                            listedUsers.push(response.id);
                        }
                    })
                }
            }
        })
    }
}

/*
Creates a box with the image, name and button to watch
a suggested user
*/
function makeSuggestedUser(usersList, response) {
    const listItem = document.createElement("div");
    listItem.style.cssText = `
        margin-top: 5px;
        margin-bottom: 5px;
        font-size: 15px;
        height: 40px;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        text-align: left;
        width: 100%;
    `
    listItem.id = response.id.toString();
    let image = ("image" in response) ? response.image : DEF_IMAGE;
    getSuggestedImage(listItem, image);
    getSuggestedName(listItem, response);
    getWatchButton(listItem, response, true);
    usersList.appendChild(listItem);
}

/*
Gets a suggested users name
*/
function getSuggestedName(listItem, response) {
    const nameBtn = document.createElement("button");
    nameBtn.textContent = response.name;
    nameBtn.className = "links";
    nameBtn.style.cssText = `
        width: 80%;
        border: none;
        background-color: transparent;
        text-align: left;
        padding: 0;
        margin-left: 10px;
    `;
    nameBtn.title = "Go to " + response.name + "'s profile page"
    nameBtn.addEventListener('click', () => {
            getProfilePage(response.id);
        }); 
    listItem.appendChild(nameBtn);
}

/*
Gets a suggested users image
*/
function getSuggestedImage(listItem, image) {
    const imageContainer = document.createElement("div");
    imageContainer.style.cssText = `
        width: 40px;
        height: 40px;
    `
    let picture = new Image();
    picture.src = image;
    picture.style.cssText = `
        margin: 0;
        width: 40px;
        height: 40px;
        border-radius: 50%;
    `;
    imageContainer.appendChild(picture);
    listItem.appendChild(imageContainer);
}