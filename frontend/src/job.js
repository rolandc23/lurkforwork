import { BACKEND_PORT } from "./config.js";
import { fileToDataUrl } from "./helpers.js";
import { getAuthUser } from './getAuthDetails.js';
import { getProfilePage, closeAddJobPostPopup, getLoginPage } from "./getPage.js";
import { displayPopup } from "./popup.js";
import { checkImage, checkJobDesc, checkJobTitle, checkStartDate } from "./check.js";

/*
Creates the add job functionality
*/
export function makeAddJob(type, post) {
    let source;
    let img = document.getElementById("jobImg");
    const jobHeader = document.getElementById('jobformheader');
    const submitContainer = document.getElementById('jobAction');
    jobHeader.textContent = type;
    if (type === "Add Job") {
        const today = new Date();
        document.getElementById("addjobtitle").value = "";
        document.getElementById("editdate").value = today.toISOString().substring(0, 10);
        document.getElementById("editjobdesc").value = "";
        img.src = "#";
        document.getElementById('uploadJobImg').textContent = "Upload Image"
        const submitJobBtn = document.createElement("button");
        submitJobBtn.type = "button";
        submitJobBtn.textContent = "Post Job";
        submitJobBtn.id = "postJob";
        submitJobBtn.disabled = true;
        submitJobBtn.addEventListener('click', () => {
            postJob(document.getElementById("jobImg").src, 'POST', "postJob");
        });
        submitContainer.appendChild(submitJobBtn);
    } else {
        const date = new Date(post.start);
        document.getElementById("addjobtitle").value = post.title;
        document.getElementById("editdate").value = date.toISOString().substring(0, 10);
        document.getElementById("editjobdesc").value = post.description;
        source = post.image;
        img.src = post.image;
        document.getElementById('uploadJobImg').textContent = "Upload Image (Leave empty too use current image)"
        const editJobBtn = document.createElement("button");
        editJobBtn.type = "button";
        editJobBtn.id = "updateJob";
        editJobBtn.textContent = "Edit Job";
        editJobBtn.disabled = true;
        editJobBtn.addEventListener('click', () => {
            postJob(document.getElementById("jobImg").src, 'PUT', 'updateJob', post.id);
        });
        submitContainer.appendChild(editJobBtn);
    }
    document.getElementById('uploadjobfile').addEventListener('change', function() {
        if (this.files && this.files[0]) {
            img.onload = () => {
                URL.revokeObjectURL(img.src);  // no longer needed, free memory
            }
            fileToDataUrl(this.files[0]).then((result) => {
                source = result;
                img.src = result;
                addJobRender(source);
            })
            .catch((Error) => {
                addJobRender(source);
                alert(Error)
            });
        }
    });
    const jobDesc = document.getElementById('editjobdesc');
    jobDesc.addEventListener("keyup", e =>{
        jobDesc.style.height = "30px";
        let scHeight = e.target.scrollHeight;
        jobDesc.style.height = `${scHeight}px`;
    });
    document.getElementById("addjobtitle").addEventListener('blur', () => {
        addJobRender(source);
    });
    document.getElementById("editdate").addEventListener('blur', () => {
        addJobRender(source);
    });
    document.getElementById("editjobdesc").addEventListener('blur', () => {
        addJobRender(source);
    });
}

/*
Posts a created job to the feed
*/
export function postJob(source, requestType, actionId, postId) {
    const authUser = getAuthUser();
    const date = new Date(addjobpost.editdate.value);
    let data = {
        "title": addjobpost.addjobtitle.value,
        "image": source,
        "start": date.toISOString(),
        "description": document.getElementById('editjobdesc').value
    }
    if (postId) {
        data = {
            "id": postId,
            "title": addjobpost.addjobtitle.value,
            "image": source,
            "start": date.toISOString(),
            "description": document.getElementById('editjobdesc').value
        }
    }
    fetch(`http://localhost:${BACKEND_PORT}/job`, {
        method: requestType,
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${authUser.token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.status === 200) {
            return Promise.resolve(response);
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
    .then(() => {
        getProfilePage(authUser.userId);
        document.getElementById("editjobdesc").style.height = "30px";
        document.getElementById("addjobtitle").value = "";
        document.getElementById("editjobdesc").value = "";
        document.getElementById("editdate").value = "";
        document.getElementById("uploadjobfile").value = "";
        document.getElementById(actionId).disabled = true;
        document.getElementById(actionId).classList.add("noHover");
        document.getElementById('jobImg').src = "#";
        closeAddJobPostPopup();
    })
    .catch(error => {
        displayPopup(error);
    });
}

/*
Check the inputs in the new job popup are valid
*/
function addJobRender(source) {
    const validJobTitle= checkJobTitle();
    const validStartDate = checkStartDate();
    const validJobDesc = checkJobDesc();
    const validImage = checkImage(source);
    let btnType;
    if (document.getElementById('updateJob')) btnType = document.getElementById('updateJob');
    if (document.getElementById('postJob')) btnType = document.getElementById('postJob');
    if (validJobTitle && validStartDate && validJobDesc && validImage) {
        btnType.disabled = false;
        btnType.classList.remove("noHover");
    } else {
        btnType.disabled = true;
        btnType.classList.add("noHover");
    }  
}

/*
Functionality behind the button 
for deleting a job post
*/
export function deleteJob(postId) {
    const authUser = getAuthUser();
    let data = {
        "id": postId
    }
    fetch(`http://localhost:${BACKEND_PORT}/job`, {
        method: 'DELETE',
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${authUser.token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.status === 200) {
            return Promise.resolve(response);
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
    .then(response => {
        getProfilePage(authUser.userId);
    })
    .catch(error => {
        alert(error);
    });
}