import { getAuthUser } from "./getAuthDetails.js";
import { getUserDeets } from "./user.js";
import { getProfilePage, getFeedPage, openAddEmailPopup, openAddJobPostPopup } from "./getPage.js";
import { DEF_IMAGE } from "./config.js";

/*
Updates the buttons on the header
*/
export function updateHeaderButtons(fromLogin) {
    const authUser = getAuthUser();
    getUserDeets(authUser.userId).then(response => {
        if (fromLogin) headerButtons(response);
    })
}

/*
Creates the buttons on the header
*/
function headerButtons(response) {
    const headIcon = document.getElementById("loggedInIcons");
    createImageButton(headIcon, response);
    activateHomeButton();
    const buttonsCont = document.createElement("div");
    createSignoutButton(buttonsCont);
    createAddJobButton(buttonsCont);
    createAddEmailButton(buttonsCont);
    headIcon.appendChild(buttonsCont);
}

/*
Creates the clickable profile picture in the header
to go to users own profile
*/
function createImageButton(headIcon, response) {
    const imageBtn = document.createElement("button");
    imageBtn.id = "imageBtn";
    imageBtn.title ="Go to your own profile page";
    let picture = new Image();
    if ("image" in response) {
        picture.src = response.image;
    } else {
        picture.src = DEF_IMAGE;
    }
    imageBtn.style.cssText = `
        background-color: transparent;
        border: none;
    `;
    picture.style.cssText = `
        margin: 0;
        border-radius: 50%;
        width: 50px;
        height: 50px;
    `;
    imageBtn.addEventListener('click', () => {
        getProfilePage(response.id);
    });
    imageBtn.appendChild(picture);
    headIcon.appendChild(imageBtn);
}


/*
Adds functionality to the home button 
Called when the home button is necessary
as a page transition
*/
function activateHomeButton() {
    const homeIcon = document.getElementById("homeBtn");
    homeIcon.title = "Go to home feed page";
    homeIcon.addEventListener('click', () => {
        getFeedPage(false);
    });
}

/*
Creates the header signout button
*/
function createSignoutButton(buttonsCont) {
    const logoutBtn = document.createElement("button");
    logoutBtn.textContent = "Sign out";
    logoutBtn.style.cssText = `margin-right: 2px;`
    logoutBtn.classList.add('blueButton');
    logoutBtn.addEventListener("click", () => {
        logout();
    })
    buttonsCont.appendChild(logoutBtn);
}

/*
Creates the new job button
*/
function createAddJobButton(buttonsCont) {
    const addJobContBtn = document.createElement("button");
    addJobContBtn.id = "addjobbtn";
    addJobContBtn.textContent = "Add Job";
    addJobContBtn.style.cssText = ` 
        margin-left: 2px;
        margin-right: 2px;
    `
    addJobContBtn.classList.add('blueButton');
    addJobContBtn.addEventListener("click", () => {
        openAddJobPostPopup("Add Job");
    });
    buttonsCont.appendChild(addJobContBtn);
}

/*
Creates the button to watch by email
*/
function createAddEmailButton(buttonsCont) {
    const addByEmailBtn = document.createElement("button");
    addByEmailBtn.id = "addemailbtn";
    addByEmailBtn.textContent = "Watch by Email";
    addByEmailBtn.style.cssText = `margin-left: 2px;`
    addByEmailBtn.classList.add('blueButton');
    addByEmailBtn.addEventListener("click", () => {
        openAddEmailPopup();
    });
    buttonsCont.appendChild(addByEmailBtn);
}

/*
Functionality to log out, simply
removes the token from storage
*/
export function logout() {
    localStorage.removeItem("authUser");
    getLoginPage();
}