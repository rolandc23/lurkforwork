import { BACKEND_PORT } from "./config.js";
import { fileToDataUrl } from "./helpers.js";
import { getAuthUser } from './getAuthDetails.js';
import { getProfilePage } from './getPage.js';
import { displayPopup } from "./popup.js";
import { checkConfirmPassword, checkEmail, checkName, checkPassword, checkEditImage } from './check.js';

/*
Creates the functionality for the profile edit form
*/
export function makeEditProfile(profile) {
    let source = profile.image;
    let img = document.getElementById("myImg");
    document.getElementById("editemail").value = profile.email;
    document.getElementById("editname").value = profile.name;
    if (profile.image) img.src = profile.image;
    document.querySelector('input[type="file"]').addEventListener('change', function() {
        if (this.files && this.files[0]) {
            img.onload = () => {
                URL.revokeObjectURL(img.src);
            }
            fileToDataUrl(this.files[0]).then((result) => {
                source = result;
                img.src = result;
                editRender(source);
                document.getElementById("invalidfile").classList.add("hidden");
            })
            .catch((Error) => {
                source = "invalid";
                editRender(source);
                document.getElementById("invalidfile").classList.remove("hidden");
                displayPopup(Error);
            });
        }
    });
    createResetBtn();
    document.getElementById('resetBtn').addEventListener('click', () => {
        resetFile(source, profile.image);
    })
    document.getElementById("editemail").addEventListener('blur', () => {
        editRender(source);
    }) 
    document.getElementById("editname").addEventListener('blur', () => {
        editRender(source);
    }) 
    document.getElementById("editpassword").addEventListener('blur', () => {
        editRender(source);
    }) 
    document.getElementById("confirmeditpw").addEventListener('blur', () => {
        editRender(source);
    }) 
    document.getElementById("savechanges").addEventListener('click', () => {
        handleSaveChanges(source, profile);
    });
}

/*
Creates the reset button
*/
function createResetBtn() {
    const btnContainer = document.getElementById('resetBtnContainer');
    const resetBtn = document.createElement("button");
    resetBtn.type = "button";
    resetBtn.id = "resetBtn";
    resetBtn.disabled = true;
    resetBtn.textContent = "Reset File";
    btnContainer.appendChild(resetBtn);
}

/*
Saves the new input from the edit profile form as users details etc.
*/
function handleSaveChanges(source, profile) {
    const authUser = getAuthUser();
    let data = {
        "name": editprofileform.editname.value,
        "image": source
    }
    if (editprofileform.editemail.value != profile.email) data.email = editprofileform.editemail.value;
    if (editprofileform.editpassword.value.length >= 6) data.password = editprofileform.editpassword.value;
    fetch(`http://localhost:${BACKEND_PORT}/user`, {
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
            getProfilePage(profile.id);
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
    .catch(error => {
        displayPopup(error);
    });
}

/* 
Runs input checking on each of the boxes to check
if the users desired changes are valid
*/
function editRender(source) {
    let validPw;
    if (editprofileform.pw.value.length === 0) {
        validPw = true;
        document.getElementById('invalideditpw').classList.add('hidden');
    } else {
        validPw = checkPassword(editprofileform, 'invalideditpw')
    }
    const validEmail = checkEmail(editprofileform, 'invalideditemail');
    const validName = checkName(editprofileform, 'invalideditnameshort', 'invalideditnamelong');
    const confirmPw = checkConfirmPassword(editprofileform, 'editpwnotmatching')
    const checkImage = checkEditImage(source);
    if (validEmail && validName && confirmPw && checkImage && validPw) {
        document.getElementById('savechanges').disabled = false;
        document.getElementById('savechanges').classList.remove("noHover");
    } else {
        document.getElementById('savechanges').disabled = true;
        document.getElementById('savechanges').classList.add("noHover");
    }
}

/*
Resets the file
*/
export function resetFile(source, saveImg) {
    const saveEmail = editprofileform.editemail.value;
    const saveName = editprofileform.editname.value;
    const savePw = editprofileform.editpassword.value;
    const saveEditPw = editprofileform.confirmeditpw.value;
    editprofileform.reset();
    editprofileform.editemail.value = saveEmail;
    editprofileform.editname.value = saveName;
    editprofileform.editpassword.value = savePw;
    editprofileform.confirmeditpw.value = saveEditPw;
    document.getElementById('myImg').src = saveImg;
    source = saveImg;
    editRender(source);
}
