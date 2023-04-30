import { BACKEND_PORT } from './config.js';
import { updateFeed } from './feed.js';
import { getLoginPage, getProfilePage } from './getPage.js';
import { getAuthUser } from './getAuthDetails.js';
import { displayPopup } from './popup.js';
import { getUserDeets } from './user.js';
import { clearDiv } from './clearDiv.js';

/*
Post comment puts a comment on a job post. 
Also updates the job post to show the comments.
*/
export function postComment(commentString, post, commCountId, postNum) {
    const authUser = getAuthUser();
    const data = {
        "id": post.id,
        "comment": commentString
    }
    const updateQuery = ~~(postNum / 5) * 5;
    const newPostNum = (postNum - updateQuery).toString();
    fetch(`http://localhost:${BACKEND_PORT}/job/comment`, {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${authUser.token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })  
    .then(response => {
        if (response.status === 200) {
            updateFeed(updateQuery).then(response1 => {
                updateComment(commCountId, response1[newPostNum], postNum.toString());
            })
            return Promise.resolve("yes");
        } else if (response.status === 400) {
            const error = "InputError, please provide a valid email address and password.";
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

// Function to update the comment box when a new comment is posted
function updateComment(commCountId, post, Id) {
    const commCount = document.getElementById(commCountId);
    commCount.textContent = post.comments.length + " comments";
    const commentBox = document.getElementById("commentBox-" + Id);
    document.getElementById("commentOutput" + Id).value = "";
    document.getElementById("commentOutput" + Id).style.height = "20px";
    clearDiv(commentBox.id);
    checkForComment(document.getElementById("commentOutput" + Id).value.length, Id);
    getAllComments(commentBox, post.comments);
    commentBox.classList.remove('hidden');
}

/*
Checks if any comments exists under a post
*/
export function checkForComment(length, Id) {
    if (length > 0) document.getElementById("postComment" + Id).classList.remove("hidden");
    if (length === 0) document.getElementById("postComment" + Id).classList.add("hidden");
}

/*
Creates the container that stores the comment boxes on a post
*/
export function getAllComments(commentsContainer, commentInfo) {
    for (let i = 0; i < commentInfo.length; i++) {
        const commentBox = document.createElement("div");
        commentBox.classList.add('dropdownBox');
        commentBox.style.cssText = `width: 100%;`;
        getComments(commentBox, commentInfo[i]);
        commentsContainer.appendChild(commentBox);
    };
    commentsContainer.classList.add("hidden");
}

/*
Creates individual boxes for comments 
and adds them to the comment box
*/
function getComments(commentBox, postComments) {
    getUserDeets(postComments.userId).then(response => {
        const userCommentBtn = document.createElement("button");
        const commentString = document.createTextNode(postComments.comment);
        userCommentBtn.className = "links";
        userCommentBtn.textContent = postComments.userName + ": ";
        userCommentBtn.title = "Go to " + response.name + "'s profile page"
        userCommentBtn.style.cssText = `
            padding: 0;
            margin: 2px;
            background-color: transparent;
            border: none;
            font: inherit;
        `;
        userCommentBtn.addEventListener('click', () => {
            getProfilePage(postComments.userId);
        }); 
        commentBox.appendChild(userCommentBtn);
        commentBox.appendChild(commentString);
    })
}
