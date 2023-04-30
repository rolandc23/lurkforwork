import { deleteJob } from './job.js';
import { addRemoveLikeComment } from './watch.js';
import { checkForComment, postComment } from './comment.js';
import { like, generatelikeList } from './like.js';
import { getProfilePage, openAddJobPostPopup } from './getPage.js';
import { getAuthUser } from './getAuthDetails.js';
import { getUserDeets } from './user.js';
import { getAllComments } from './comment.js';
import { updateFeed } from './feed.js';

/*
Gets necessary posts on a profile
*/
export function getPosts(posts, elementId, isOwnProfile, startingQuery, searchRes) {
    const authUser = getAuthUser();
    if (posts) posts.sort(compare);
    const promises = [];
    const element = document.getElementById(elementId);
    for (let id in posts) {
        promises.push(makePost(posts[id], parseInt(id, 10), isOwnProfile, startingQuery, searchRes));
    }
    Promise.all(promises).then((blog) => {
        for (let id in posts) {
            element.appendChild(blog[id]);
        }
    });
    if (posts[0]) {
        getUserDeets(posts[0].creatorId).then(response => {
            if (response.watcheeUserIds.includes(authUser.userId)) {
                addRemoveLikeComment(true);
            } else {
                addRemoveLikeComment(false);
            }
        })
    }
}

/*
Creates a dummy post when there is no posts on a users profile
the space was a bit empty 
*/
export function getEmptyPosts(elementId) {
    const element = document.getElementById(elementId);
    const emptyBlog = document.createElement("div");
    emptyBlog.textContent = "No jobs to show.";
    emptyBlog.id = "0";
    emptyBlog.style.cssText = `
        text-align: center;
        font-size: 20pt;
    `;
    emptyBlog.classList.add('blogPost');
    element.appendChild(emptyBlog);
}

/*
Comparison function used to sort two posts by their creation date
used to sort all job posts in reverse chronological order
*/
function compare(a, b) {
    let dateA = new Date(a.createdAt);
    let dateB = new Date(b.createdAt);
    return (dateB > dateA) ? 1 : -1;
}

/*
Returns the time in specific formats based on the time
*/
function getPostTime(createdAt) {
    const date1 = new Date(Date.parse(createdAt));
    let timediff = (Date.now() - Date.parse(createdAt)) / (1000 * 60 )
    let hours = ~~(timediff / 60)
    let minutes = ~~(timediff % 60)
    let date = String(date1.getUTCDate()) + '/' + String(date1.getUTCMonth() + 1) + '/' + String(date1.getUTCFullYear())
    return (timediff  <= 24*60) ? (String(hours) + " hours " + String(minutes) + " minutes ago") : (date)
}

/*
Creates a post and adds its details and various buttons (like/comment)
Allows a post's poster to be clicked, and the post to be liked/commented
*/
function makePost(post, postNum, isOwnProfile, startingQuery, searchRes) {
    const authUser = getAuthUser();
    const blog = document.createElement("div");
    blog.id = (postNum + startingQuery).toString();
    blog.classList.add('blogPost');
    return new Promise ((resolve) => {
        getUserDeets(post.creatorId).then(response => {
            getCreator(blog, response.name, response.id, isOwnProfile);
            getCreatedAt(blog, post.createdAt);
            getImage(blog, post);
            getJobTitle(blog, post.title);
            getJobStart(blog, post.start);
            getJobDesc(blog, post.description);
            createLikesButton(blog, post);
            createCommentsButton(blog, post);
            makeLikeButton(blog, post);
            addCommentInput(blog, post);
            if (authUser.userId === response.id) {
                makeEditJobButton(blog, post);
                makeDeleteJobButton(blog, post);
            }
            if (searchRes) {
                let postString = post.title + new Date(Date.parse(post.start)).toDateString() 
                    + post.description + response.name + getPostTime(post.createdAt);
                postString = postString.toLowerCase().replace(/\s/g, '');
                if (!postString.includes(searchRes)) {
                    blog.classList.add('hidden');
                }
            }
            resolve(blog);
        })
    })
}

/*
Creates the input to leave a comment
*/
function addCommentInput(container, post) {
    const commCountId = "commentcount-" + container.id;
    const addCommentContainer = document.createElement("div");
    addCommentContainer.classList.add("removeable");
    addCommentContainer.textContent = "Write Comment: ";
    addCommentContainer.style.cssText = `
        width: 100%;
        padding: 0;
        margin: 0;
        font-size: 12px;
    `;
    const addComment = document.createElement("textarea");
    addComment.id = "commentOutput" + container.id;
    addComment.placeholder = "Write your comments here";
    const postCommentBtn = document.createElement("button");
    postCommentBtn.id = "postComment" + container.id;
    postCommentBtn.classList.add("hidden");
    postCommentBtn.type = "submit";
    postCommentBtn.textContent = "Post Comment";
    addComment.addEventListener("keyup", e =>{
        addComment.style.height = "20px";
        let scHeight = e.target.scrollHeight;
        addComment.style.height = `${scHeight}px`;
        checkForComment(addComment.value.length, container.id);
    });
    postCommentBtn.addEventListener("click", () => {
        const commentString = document.getElementById("commentOutput" + container.id).value;
        postComment(commentString, post, commCountId, parseInt(container.id, 10));
    })
    addCommentContainer.appendChild(addComment);
    addCommentContainer.appendChild(postCommentBtn);
    container.appendChild(addCommentContainer);
}

/*
Goes to the creator of the posts profile
*/
function getCreator(container, name, Id, isOwnProfile) {
    const creatorButton = document.createElement("button");
    creatorButton.textContent = name;
    creatorButton.className = "links";
    creatorButton.style.cssText = `
        font-size: 25px;
        font-weight: bold;
        width: 80%;
        border: none;
        background-color: transparent;
        text-align: left;
        padding: 0;
    `;
    if (!isOwnProfile) {
        creatorButton.title = "Go to " + name + "'s profile page"
        creatorButton.addEventListener('click', () => {
            getProfilePage(Id);
        }); 
    }
    container.appendChild(creatorButton);
}

/*
Adds the image to the post
*/
function getImage(container, post) {
    const postContainer = document.createElement("div");
    postContainer.style.cssText = `
        position: absolute;
        text-align: center;
        top: 5px;
        right: 5px;
        width: 30%;
    `;
    let picture = new Image();
    picture.src = post.image;
    picture.style.cssText = `
        margin: 0;
        width: 110px;
        height: 110px;
    `;
    postContainer.appendChild(picture);
    container.appendChild(postContainer);
}

/*
Adds the job title to the post
*/
function getJobTitle(container, title) {
    const postContainer = document.createElement("div");
    postContainer.textContent = "Job Title: " + title;
    postContainer.style.cssText = `
        font-size: 12pt;
        padding-bottom: 5px;
        padding-left: 10px;
        width: 50%;
    `;
    container.appendChild(postContainer);
}   

/*
Adds the job starting date to the post
*/
function getJobStart(container, start) {
    const postContainer = document.createElement("div");
    const dateText = new Date(Date.parse(start)).toDateString();
    postContainer.textContent = "Start Date: " + dateText;
    postContainer.style.cssText = `
        font-size: 12pt;
        padding-bottom: 8px;
        padding-left: 10px;
        width: 50%;
    `;
    container.appendChild(postContainer);
}   

/*
Adds the job description to the post
*/
function getJobDesc(container, desc) {
    const postContainer = document.createElement("div");
    postContainer.textContent = "Job Description: " + desc;
    postContainer.style.cssText = `
        font-size: 11pt;
        padding-bottom: 15px;
        padding-left: 10px;
    `;
    container.appendChild(postContainer);
}   

/*
Adds the time of post to the post
*/
function getCreatedAt(container, date) {
    const postContainer = document.createElement("div");
    postContainer.textContent = getPostTime(date);
    postContainer.style.cssText = `
        font-size: 10pt;
        padding-bottom: 10px;
        width: 50%;
    `;
    container.appendChild(postContainer);
}

/*
Adds the likes count to the post
Also serves as a button to show the users who liked the post
*/
function createLikesButton(container, post) {
    const postContainer = document.createElement("div");
    const likeButton = document.createElement("button");
    postContainer.appendChild(likeButton);
    likeButton.textContent = post.likes.length + " likes";
    likeButton.id = "likecount-" + container.id;
    likeButton.className = "links";
    likeButton.style.cssText = `
        font-size: 13px;
        border: none;
        background-color: transparent;
        text-align: left;
        padding: 0;
    `;
    likeButton.title = "Show Likes"
    likeButton.addEventListener('click', () => {
        const likesBox = document.getElementById("likedBox-" + container.id);
        if (likesBox.classList.contains("hidden")) {
            likeButton.title = "Show Likes"
            likesBox.classList.remove("hidden");
        }
        else {
            likeButton.title = "Hide Likes"
            likesBox.classList.add("hidden");
        }
    }); 
    container.appendChild(postContainer);
    createLikedBox(container, post);
}

/*
Gets individual names of users who liked a post
*/
function createLikedBox(container, post) {
    const postContainer = document.createElement("div");
    postContainer.id = "likedBox-" + container.id;
    postContainer.classList.add('dropdownBox');
    postContainer.classList.add('hidden');
    generatelikeList(post, postContainer);
    container.appendChild(postContainer);
}

/*
Adds the comments count to the post
Also serves as a button to show the comments on a post
*/
function createCommentsButton(container, post) {
    const postContainer = document.createElement("div");
    const commentButton = document.createElement("button");
    postContainer.appendChild(commentButton);
    commentButton.textContent = post.comments.length + " comments";
    commentButton.id = "commentcount-" + container.id;
    commentButton.className = "links";
    commentButton.style.cssText = `
        font-size: 13px;
        border: none;
        background-color: transparent;
        text-align: left;
        padding: 0;
    `;
    commentButton.title = "Show Comments"
    commentButton.addEventListener('click', () => {
        const commentsBox = document.getElementById("commentBox-" + container.id);
        if (commentsBox.classList.contains("hidden")) {
            commentButton.title = "Show Comments"
            commentsBox.classList.remove("hidden");
        }
        else {
            commentButton.title = "Hide Comments"
            commentsBox.classList.add("hidden");
        }
    }); 
    const commentsContainer = document.createElement("div");
    commentsContainer.id = "commentBox-" + container.id;
    getAllComments(commentsContainer, post.comments);
    container.appendChild(postContainer);
    container.appendChild(commentsContainer);
}

/*
Creates a button to like or unlike a post
*/
function makeLikeButton(container, post) {
    const authUser = getAuthUser();
    const query = ~~(parseInt(container.id, 10) / 5) * 5;
    const postNum = parseInt(container.id, 10) - query;
    const likeid = "likecount-" + container.id;
    const btn = document.createElement("button");
    btn.classList.add("removeable");
    const likeString = "Like";
    const dislikeString = "Unlike";
    if (!checkLike(authUser.userId, post.likes)) {
        btn.textContent = likeString;
        btn.classList.add("blueBtnToggleSmall");
        btn.classList.remove("blueBtnToggleBig");
    } else {
        btn.textContent = dislikeString;
        btn.classList.remove("blueBtnToggleSmall");
        btn.classList.add("blueBtnToggleBig");
    }
    btn.addEventListener('click', () => {
        updateFeed(query).then(response => {
            if (!checkLike(authUser.userId, response[postNum].likes)) {
                btn.textContent = dislikeString;
                btn.classList.remove("blueBtnToggleSmall");
                btn.classList.add("blueBtnToggleBig");
                like(post.id, true, likeid, postNum, query);
            } else {
                btn.textContent = likeString;
                btn.classList.add("blueBtnToggleSmall");
                btn.classList.remove("blueBtnToggleBig");
                like(post.id, false, likeid, postNum, query);
            }
        })
    });
    container.appendChild(btn);
}

/*
Creates a button to delete a job post
*/
function makeDeleteJobButton(container, post) {
    const btn = document.createElement("button");
    btn.textContent = "Delete Post";
    btn.style.cssText = `margin-left: 2px;`
    btn.classList.add('blueButton');
    btn.addEventListener('click', () => {
        deleteJob(post.id);
    });
    container.appendChild(btn);
}

/*
Creates a button to edit an existing job post
*/
function makeEditJobButton(container, post) {
    const btn = document.createElement("button");
    btn.id = post.id.toString();
    btn.textContent = "Edit Job";
    btn.style.cssText = `margin-right: 2px;`
    btn.classList.add('blueButton');
    btn.addEventListener('click', () => {
        openAddJobPostPopup("Edit Job #" + btn.id, post)
    });
    container.appendChild(btn);
}

/*
Checks if a user has liked a post
*/
function checkLike(authUserId, postLikes) {
    for (let Like in postLikes) {
        if (authUserId === postLikes[Like].userId) return true;
    }
    return false;
}