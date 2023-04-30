import { checkPassword, checkConfirmPassword, checkEmail, checkId } from './check.js';
import { logout } from './header.js';
import { getAuthUser } from './getAuthDetails.js';
import { closeForgotPwForm } from './getPage.js';
import { displayPopup } from './popup.js';
import { getUserDeets } from './user.js';
import { handleWatchUser } from './watch.js';
import { BACKEND_PORT } from './config.js';
import { getMaxHeight } from './height.js';

/*
Creates the form necessary for forgot password
*/
export function makeForgotPwForm() {
    const formContainer = document.getElementById("forgotpwbuttondiv");
    makeSubmitButton(formContainer);
}


/*
Submit button for forgot password form
*/
function makeSubmitButton(container) {
    const submitBtn = document.createElement("button");
    submitBtn.type = "button";
    submitBtn.id = "forgotpwsubmit";
    submitBtn.textContent = "Submit Details";
    submitBtn.addEventListener('click', () => {
        makeDummyToken().then(response => {
            localStorage.setItem('authUser', JSON.stringify(response));
            verifyEmail();
        });
    })
    submitBtn.disabled = true;
    container.appendChild(submitBtn);
}

/*
Checks the email in the form
*/
export function renderForgotPw() {
    const validEmail = checkEmail(forgotpwform, 'invalidforgotpwemail');
    const validId = checkId();
    if (validEmail && validId) {
        document.getElementById("forgotpwsubmit").disabled = false;
    } else {
        document.getElementById("forgotpwsubmit").disabled = true;
    }
}

/*
Creates a dummy token
This allows the email in the form to be checked
if it is tied to an account or has not been registered.
*/
function makeDummyToken() {
    const dummy = { 
        "email": Math.random().toString(36).slice(2, 10) + "@email.com", 
        "password": "dummyacc", 
        "name": "dummy"
    }
    return fetch(`http://localhost:${BACKEND_PORT}/auth/register`, {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dummy),
    })  
    .then(response => {
        if (response.status === 200) {
            return Promise.resolve(response);
        } else {
            const error = "fuck";
            Promise.reject(error);
        }
    })
    .then(response => response.json())
    .catch(error => {
        displayPopup(error);
    });
}

/*
Checks the email
*/
function verifyEmail() {
    handleWatchUser(forgotpwform.email.value, false)
    .then((bool) => {
        if (bool === false) {
            verifyId();
        }
    });
}

/*
Checks the given ID is tied to the email provided
*/
function verifyId() {
    getUserDeets(forgotpwform.id.value)
    .then(response => {
        if (response && response.email === forgotpwform.email.value) {
            closeForgotPwForm();
            openNewPwForm();
        } else {
            displayPopup("User does not exist, or it does not match with the given email")
        }
    })
}

/*
Clears the form
*/
export function clearForgotPwForm() {
    forgotpwform.email.value = "";
    forgotpwform.id.value = "";
    document.getElementById('invalidforgotpwemail').classList.add('hidden');
    document.getElementById('invalidforgotpwid').classList.add('hidden');
}

/*
Creates a form the input the new password
*/
function openNewPwForm() {
    let height = getMaxHeight();
    document.getElementById("headerSignUp").disabled = true;
    document.getElementById("headerLogin").disabled = true;
    document.getElementById("newPw").classList.remove("hidden");
    document.getElementById("newPw").style.height = `${height}px`;
    const submitPwDiv = document.getElementById("newpwsubmitdiv");
    makeSubmitNewPwButton(submitPwDiv);
}

/*
Creates a button that submits the new password
This can not completely work without changing the backend,
there is no way to submit a change to password or obtain a users password 
without a logged in token.
*/
function makeSubmitNewPwButton(container) {
    const submitPwBtn = document.createElement("button");
    submitPwBtn.textContent = "Confirm Password Change";
    submitPwBtn.id = "changepwbtn";
    submitPwBtn.type = "button";
    container.appendChild(submitPwBtn);
    submitPwBtn.disabled = true;
    submitPwBtn.addEventListener('click', () => {
        const authUser = getAuthUser();
        let data = {
            "password": newPwForm.pw.value,
        }
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
                document.getElementById("headerSignUp").disabled = false;
                document.getElementById("headerLogin").disabled = false;
                logout();
                displayPopup("Password has NOT been changed! (note that this function hasn't actually been implemented properly due to limitations of the backend server)")
            } else {
                const error = "GG NO RE";
                return Promise.reject(error);
            }
        })
        .catch(error => {
            logout();
            displayPopup(error);
        });
        document.getElementById("newPw").classList.add("hidden");
    })
}

/* 
Checks the new password
*/
export function renderNewPw() {
    const validPw = checkPassword(newPwForm, "invalidnewpw");
    const validConfirmPw = checkConfirmPassword(newPwForm, "invalidnewconfirmpw");
    if (validPw && validConfirmPw) {
        document.getElementById("changepwbtn").disabled = false;
    } else {
        document.getElementById("changepwbtn").disabled = true;
    }
}