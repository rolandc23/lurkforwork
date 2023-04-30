import { BACKEND_PORT } from './config.js';
import { getUserDeets } from './user.js';
import { updateButtonState } from './profile.js';
import { closeAddEmailPopup, getFeedPage, getProfilePage } from './getPage.js';
import { getAuthUser } from './getAuthDetails.js';
import { displayPopup } from './popup.js';
import { clearDiv } from './clearDiv.js';

/*
Watches a user 
*/
export function watchUser(userProfile, bool, watchCountId, profileNum) {
    handleWatchUser(userProfile.email, bool).then(() => {
        getUserDeets(userProfile.id).then(response1 => {
            if (document.getElementById("profiledeets").name === profileNum.toString()) {
                updateWatch(watchCountId, response1, profileNum);
                addRemoveLikeComment(bool);
            }
            const authUserId = getAuthUser().userId;
            const buttons = document.getElementsByClassName('watchbtn-' + response1.id);
            for (let i = 0; i < buttons.length; i++) {
                updateButtonState(authUserId, response1.watcheeUserIds, buttons[i])
            }
        });
    })
}


/*
Removes the like and comment buttons if a user does not watch 
the user who posted the job
*/
export function addRemoveLikeComment(bool) {
    const likeCommAction = document.getElementsByClassName("removeable");
    for (let i = 0; i < likeCommAction.length; i++) {
        if (bool) {
            likeCommAction[i].classList.remove('hidden')
        } else {
            likeCommAction[i].classList.add('hidden');
        }
    }
}

/*
Creates the popup on successful watch user by email
*/
function watchUserPopup (email, bool) {
    handleWatchUser(email, bool)
    .then((bool) => {
        if (bool === false) {
            getFeedPage(bool);
            emailform.watchEmail.value = "";
            closeAddEmailPopup();
            displayPopup(" Success, you are now watching user with the email " + email);
        }
    })
}

/*
Gets count of job posts of a user
*/
export function makeAddBtn() {
    const btnContainer = document.getElementById('addEmailContainer');
    const submitEmailBtn = document.createElement("button");
    submitEmailBtn.type = "button";
    submitEmailBtn.textContent = "Watch user";
    submitEmailBtn.id = "postEmail";
    submitEmailBtn.disabled = true;
    submitEmailBtn.addEventListener('click', () => {
        watchUserPopup(emailform.watchEmail.value, true);
    })
    btnContainer.appendChild(submitEmailBtn);
    document.getElementById("watchEmail").addEventListener('change', () => {
        checkWatchEmail();
    });
}

/*
Backend functionality to watch a user
*/
export function handleWatchUser(email, bool) {
    const authUser = getAuthUser();
    const data = {
        "email": email,
        "turnon": bool
    }
    return fetch(`http://localhost:${BACKEND_PORT}/user/watch`, {
        method: 'PUT',
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${authUser.token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.status === 200) {
            return Promise.resolve(false);
        } else if (response.status === 400) {
            const error = "InputError, the email is not tied with an existing user";
            return Promise.reject(error);
        } else if (response.status === 403) {
            const error = "AccessError, your session has expired, please log in again.";
            localStorage.removeItem("authUser");
            getLoginPage();
            return Promise.reject(error);
        } else if (response.status === 404) {
            const error = "404 Error: Not found, check that the server is up";
            return Promise.reject(error);
        } else if (response.status === 500) {
            const error = "TypeError, input cannot be read";
            return Promise.reject(error);
        }
    })
    .catch(error => {
        displayPopup(error);
    })
}

/*
Updates the watch count
*/
function updateWatch(watchCountId, profile, id) {
    const watchCount = document.getElementById(watchCountId);
    if (watchCount) {
        watchCount.textContent = profile.watcheeUserIds.length + " watchers";
        const watchedBox = document.getElementById("watchedBox-" + id);
        clearDiv(watchedBox.id);
        generateWatcheeList(profile.watcheeUserIds, watchedBox);
    }
}

/*
Checks the email in watch by email is valid
*/
function checkWatchEmail() {
    let validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!emailform.watchEmail.value.match(validRegex)) {
        document.getElementById('invalidwatchemail').classList.remove('hidden');
        document.getElementById('postEmail').disabled = true;
    } else {
        document.getElementById('invalidwatchemail').classList.add('hidden');
        document.getElementById('postEmail').disabled = false;
    }
}

/*
Creates a list of watchees
*/
export function generateWatcheeList(watchList, watchBox) {
    for (let Id in watchList) {
        getUserDeets(watchList[Id]).then(response => {
            const newDiv = document.createElement("div");
            const watchingUserButton = document.createElement("button");
            watchingUserButton.textContent = response.name;
            watchingUserButton.className = "links";
            watchingUserButton.title = "Go to " + response.name + "'s profile page"
            watchingUserButton.style.cssText = `
                padding: 0;
                margin: 2px;
                background-color: transparent;
                border: none;
                font: inherit;
            `;
            watchingUserButton.addEventListener('click', () => {
                getProfilePage(response.id);
            }); 
            newDiv.appendChild(watchingUserButton);
            watchBox.appendChild(newDiv);
        })
    }
}