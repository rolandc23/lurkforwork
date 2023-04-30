import { BACKEND_PORT } from './config.js';
import { getUserDeets } from './user.js';
import { getAuthUser } from './getAuthDetails.js';
import { displayPopup } from './popup.js';
import { getMaxHeight } from './height.js';
import { createSimilarUsers } from './suggested.js';
import { updateHeaderButtons } from './header.js';
import { getPosts } from './posts.js';
import { clearDiv } from './clearDiv.js';

/* 
Handles the creation of the feed,
Also creates the suggested users card on the right
*/
export function handleFeed(fromLogin) {
    document.getElementById('feed').name = (0).toString();
    document.getElementById("feed").classList.remove('searching');
    clearDiv("feed");
    clearDiv("profiledeets");
    clearDiv("profileposts");
    document.getElementById('searchjobtext').value = "";
    updateFeed(0).then(response => {
        getPosts(response, "feed", false, 0);
        updateHeaderButtons(fromLogin);
    })
    const authUser = getAuthUser();
    getUserDeets(authUser.userId).then(response => {
        updateSuggestedUsers(response.watcheeUserIds, authUser.userId);
    })
}

/*
Manages the ability to infinitely scroll the job posts on feed
*/
window.onscroll = function() {
    let scrollHeight = getMaxHeight();
    if (window.scrollY + window.innerHeight > scrollHeight - 1 
    && !document.getElementById('feedpage').classList.contains('hidden')
    && !document.getElementById('feed').classList.contains('searching')) {
        const feedDiv = document.getElementById('feed');
        const newQuery = parseInt(feedDiv.name, 10) + 5;
        feedDiv.name = newQuery.toString();
        updateFeed(newQuery).then(response => {
            if (response.length > 0) {
                getPosts(response, "feed", false, newQuery);
            }
        })
    }
};

/*
Updates the suggested users
Called when the job feed page is loaded or a 
profile is loaded.
*/
export function updateSuggestedUsers(list, id) {
    clearDiv("userList");
    createSimilarUsers(list, id);
}

/*
Updates the feed 
*/
export function updateFeed(query) {
    const authUser = getAuthUser();
    return fetch(`http://localhost:${BACKEND_PORT}/job/feed?start=${query}`, {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${authUser.token}`,
        },
    })  
    .then(response => {
        if (response.status === 200) {
            return Promise.resolve(response);
        } else if (response.status === 400) {
            const error = "InputError, please enter something valid";
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
    .then(response => response.json())
    .catch(error => {
        displayPopup(error);
    })
}