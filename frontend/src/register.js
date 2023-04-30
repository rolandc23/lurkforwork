import { BACKEND_PORT } from './config.js';
import { displayPopup } from './popup.js';
import { getFeedPage, getLoginPage } from './getPage.js';
import { checkConfirmPassword, checkEmail, checkName, checkPassword } from './check.js';
import { getAuthUser } from './getAuthDetails.js';

/*
Gets count of job posts of a user
*/
export function handleRegister() {
    const registration = { 
        "email": registerform.email.value, 
        "password": registerform.pw.value, 
        "name": registerform.name.value
    }
    fetch(`http://localhost:${BACKEND_PORT}/auth/register`, {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(registration),
    })  
    .then(response => {
        if (response.status === 200) {
            response.json().then(response => {
                localStorage.setItem('authUser', JSON.stringify(response));
                const authUser = getAuthUser();
                displayPopup("Congratulations, you just signed up! Your user ID number is " 
                    + authUser.userId.toString()
                    + ", please keep this saved somewhere in the case you forget your password. :)"
                );
                clearRegisterForm();
                getFeedPage(true);
            })
            return Promise.resolve("yes");
        } else if (response.status === 400) {
            const error = "InputError, email entered has already been used.";
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
Clears the inputs in register form
*/
export function clearRegisterForm() {
    registerform.email.value = "";
    registerform.pw.value = "";
    registerform.confirmpw.value = "";
    registerform.name.value = "";
    document.getElementById('invalidemail').classList.add('hidden');
    document.getElementById('invalidnameshort').classList.add('hidden');
    document.getElementById('invalidnamelong').classList.add('hidden');
    document.getElementById('invalidpw').classList.add('hidden');
    document.getElementById('pwnotmatching').classList.add('hidden');
}

/*
Checks the inputs in the register form 
and updates the signup button to be valid
*/
export function render() {
    const validEmail = checkEmail(registerform, 'invalidemail');
    const validName = checkName(registerform, 'invalidnameshort', 'invalidnamelong');
    const validPw = checkPassword(registerform, 'invalidpw');
    const validConfirm = checkConfirmPassword(registerform, 'pwnotmatching');
    if (validEmail && validName && validPw && validConfirm) {
        document.getElementById('signup').disabled = false;
        document.getElementById('signup').classList.remove('noHover');
    } else {
        document.getElementById('signup').disabled = true;
        document.getElementById('signup').classList.add('noHover');
    }
}

