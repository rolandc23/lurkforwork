import { BACKEND_PORT } from './config.js';
import { updateFeed } from './feed.js';
import { getLoginPage, getProfilePage } from './getPage.js';
import { getAuthUser } from './getAuthDetails.js';
import { displayPopup } from './popup.js';
import { getUserDeets } from './user.js';
import { clearDiv } from './clearDiv.js';

/*
Functionality to like a post
*/
export function like(postId, bool, likecommid, postNum, query) {
    const authUser = getAuthUser();
    const data = {
        "id": postId,
        "turnon": bool
    }
    fetch(`http://localhost:${BACKEND_PORT}/job/like`, {
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
            updateFeed(query).then(response1 => {
                updateLikeDislike(likecommid, response1[postNum], postNum);
            })
            return Promise.resolve("yes");
        } else if (response.status === 400) {
            const error = "InputError, please enter something valid.";
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
    });
}

/*
Updates the like count on a job post
*/
function updateLikeDislike(likecommid, post, id) {
    const likecommcount = document.getElementById(likecommid);
    likecommcount.textContent = post.likes.length + " likes";
    const likedBox = document.getElementById("likedBox-" + id);
    clearDiv(likedBox.id);
    generatelikeList(post, likedBox);
}

/*
Creates the list of users who liked a post 
*/
export function generatelikeList(post, postContainer) {
    for (let like in post.likes) {
        getUserDeets(post.likes[like].userId).then(response => {
            const newDiv = document.createElement("div");
            const likeUserButton = document.createElement("button");
            likeUserButton.textContent = response.name;
            likeUserButton.className = "links";
            likeUserButton.title = "Go to " + response.name + "'s profile page"
            likeUserButton.style.cssText = `
                padding: 0;
                margin: 2px;
                background-color: transparent;
                border: none;
                font: inherit;
            `;
            likeUserButton.addEventListener('click', () => {
                getProfilePage(response.id);
            }); 
            newDiv.appendChild(likeUserButton);
            postContainer.appendChild(newDiv);
        })
    }
}