import { getUserDeets } from "./user.js";
import { DEF_IMAGE } from "./config.js";
import { getEditPage } from "./getPage.js";
import { watchUser, generateWatcheeList } from "./watch.js";
import { getAuthUser } from './getAuthDetails.js';
import { getPosts, getEmptyPosts } from "./posts.js";
import { updateSuggestedUsers } from './feed.js';
import { clearDiv } from './clearDiv.js';

/*
Handles creation of a users profile given a profileid
*/
export function handleProfile(profileId) {
    clearDiv("feed");
    clearDiv("profiledeets");
    clearDiv("profileposts");
    const authUser = getAuthUser();
    document.getElementById("homeBtn").disabled = false;
    const element1 = document.getElementById("profiledeets");
    element1.name = profileId.toString();
    const userContainer = document.createElement("div");
    userContainer.id = profileId.toString();
    userContainer.style.cssText = `left: clamp(0rem, -44.41rem + 48.206vw, 13.438rem);`
    userContainer.classList.add('sideCard');
    getUserDeets(authUser.userId).then(response => {
        updateSuggestedUsers(response.watcheeUserIds, authUser.userId);
    })
    getUserDeets(profileId).then(response => {
        getName(userContainer, response.name);
        getImage(userContainer, response);
        getEmail(userContainer, response.email, response.name);
        createWatcheeListButton(userContainer, response.watcheeUserIds);
        getJobCount(userContainer, response.jobs);
        if (authUser.userId != response.id) {
            getWatchButton(userContainer, response, false);
        } else {
            getUserId(userContainer, response.id, response.name);
            getEditButton(userContainer, response);
        }
        element1.appendChild(userContainer);
        getJobs(response.jobs, "profileposts");
    })
}

/*
Creates button to edit profile
*/
function getEditButton(container, profile) {
    const editContainer = document.createElement("div");
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit Profile";
    editBtn.style.cssText = `
        margin-right: 5px;
        margin-left: 10px;
    `
    editBtn.classList.add('blueButton');
    editBtn.addEventListener('click', () => {
        getEditPage(profile);
    }); 
    editContainer.appendChild(editBtn);
    container.appendChild(editContainer);
}

/*
Creates the count for watchees,
also serves as a button to show who watches a user
*/
function createWatcheeListButton (container, watchList) {
    const watcheeContainer = document.createElement("div");
    const openListButton = document.createElement("button");
    watcheeContainer.appendChild(openListButton);
    openListButton.textContent = watchList.length + " watchers";
    openListButton.id = "watchCount-" + container.id;
    openListButton.className = "links";
    openListButton.style.cssText = `
        font: inherit;
        border: none;
        background-color: transparent;
        text-align: left;
        padding: 0;
        padding-left: 10px;
    `;
    openListButton.title = "Show watchees"
    openListButton.addEventListener('click', () => {
        const watcheeBox = document.getElementById("watchedBox-" + container.id);
        if (watcheeBox.classList.contains("hidden")) {
            watcheeBox.title = "Show watchees"
            watcheeBox.classList.remove("hidden");
        }
        else {
            watcheeBox.title = "Hide watchees"
            watcheeBox.classList.add("hidden");
        }
    }); 
    container.appendChild(watcheeContainer);
    createWatcheeBox(container, watchList);
}

/*
Gets the individual watchees of a user
*/
function createWatcheeBox(container, watchList) {
    const watchBox = document.createElement("div");
    watchBox.id = "watchedBox-" + container.id;
    watchBox.classList.add("hidden");
    watchBox.style.cssText = `margin-left: 10px;`;
    watchBox.classList.add('dropdownBox');
    generateWatcheeList(watchList, watchBox);
    container.appendChild(watchBox);
}

/*
Creates the button to watch a user if the 
profile is not the users
*/
export function getWatchButton(container, userProfile, isForSuggested) {
    const authUser = getAuthUser();
    const profileNum = parseInt(container.id, 10);
    const watchCountId = "watchCount-" + container.id;
    const btn = document.createElement("button");
    btn.classList.add('watchbtn-' + userProfile.id.toString());
    if (isForSuggested) {
        btn.classList.add('listWatchBtn')
    }
    else {
        btn.style.cssText = `margin-left: 10px;`
    }
    updateButtonState(authUser.userId, userProfile.watcheeUserIds, btn);
    btn.addEventListener('click', () => {
        getUserDeets(userProfile.id).then(response => {
            if (!checkWatching(authUser.userId, response.watcheeUserIds)) {
                btn.textContent = "Unwatch";
                btn.classList.remove("blueBtnToggleSmall");
                btn.classList.add("blueBtnToggleBig");
                watchUser(userProfile, true, watchCountId, profileNum);
            } else {
                btn.textContent = "Watch";
                btn.classList.add("blueBtnToggleSmall");
                btn.classList.remove("blueBtnToggleBig");
                watchUser(userProfile, false, watchCountId, profileNum);
            }
        })
    });
    container.appendChild(btn);
}

/*
Updates the button state if user is watching or not watching
*/
export function updateButtonState(authUserId, profileWatchees, btn) {
    if (!checkWatching(authUserId, profileWatchees)) {
        btn.textContent = "Watch";
        btn.classList.add("blueBtnToggleSmall");
        btn.classList.remove("blueBtnToggleBig");
    } else {
        btn.textContent = "Unwatch";
        btn.classList.remove("blueBtnToggleSmall");
        btn.classList.add("blueBtnToggleBig");
    }
}

/*
Checks if  the user is watching another
*/
function checkWatching(authUserId, profileWatcheeIds) {
    for (let Id in profileWatcheeIds) {
        if (authUserId === profileWatcheeIds[Id]) return true;
    }
    return false;
}

/*
Adds the name to the profile card
*/
function getName(container, name) {
    const nameContainer =  document.createElement("div");
    const profileHeader = document.createElement("h1");
    profileHeader.textContent = name;
    profileHeader.style.cssText = `
        margin: 0;
        font-size: 25px;
        font-weight: bold;
        width: 70%;
        border: none;
        padding: 0;
    `;
    nameContainer.appendChild(profileHeader);
    container.appendChild(nameContainer);
}

/*
Adds the users ID to the profile card
only shows on one's own profile
*/
function getUserId(container, Id, name) {
    const profileContainer = document.createElement("div");
    profileContainer.textContent = "ID: " + Id;
    profileContainer.className = "links";
    profileContainer.title = "Copy " + name + "'s user ID";
    profileContainer.style.cssText = `
        padding: 0;
        padding-left: 10px;
        margin: 0;
        background-color: transparent;
        border: none;
        font: inherit;
    `;
    profileContainer.addEventListener('click', () => {
        navigator.clipboard.writeText(Id);
    });
    container.appendChild(profileContainer);
}

/*
Adds a users email to the profile card
also clickable to copy to clipboard
*/
function getEmail(container, email, name) {
    const profileContainer = document.createElement("button");
    profileContainer.textContent = "Email: " + email;
    profileContainer.className = "links";
    profileContainer.title = "Copy " + name + "'s email";
    profileContainer.style.cssText = `
        padding: 0;
        padding-left: 10px;
        margin: 0;
        background-color: transparent;
        border: none;
        font: inherit;
    `;
    profileContainer.addEventListener('click', () => {
        navigator.clipboard.writeText(email);
    });
    container.appendChild(profileContainer);
}

/*
Adds a users image to their profile card
*/
function getImage(container, response) {
    const profileContainer = document.createElement("div");
    const picture = document.createElement("img");
    profileContainer.style.cssText = `
        position: absolute;
        top: 7px;
        right: 7px;
    `;
    let image = ("image" in response) ? response.image : DEF_IMAGE;
    picture.src = image;
    picture.style.cssText = `
        margin: 0;
        width: 80px;
        height: 80px;
    `;
    profileContainer.appendChild(picture);
    container.appendChild(profileContainer);
}

/*
Gets count of job posts of a user
*/
function getJobCount(userContainer, jobs) {
    const userJobCont = document.createElement("div");
    userJobCont.textContent = jobs.length + " Jobs";
    userJobCont.style.cssText = `
        padding-left: 10px
    `
    userContainer.appendChild(userJobCont);
}

/*
Gets the posts of a user
*/
export function getJobs(jobs, elementId) {
    if (jobs.length != 0) {
        getPosts(jobs, elementId, true, 0);
    }
    else  {
        getEmptyPosts(elementId);
    }
}