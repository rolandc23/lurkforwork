import { BACKEND_PORT } from './config.js';
import { getFeedPage, getLoginPage } from './getPage.js';
import { displayPopup } from './popup.js';

/*
Logs a user in given user details
*/
export function handleLogin() {
    const data = {
        "email": loginform.email.value,
        "password": loginform.pw.value,
    }
    fetch(`http://localhost:${BACKEND_PORT}/auth/login`, {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }) 
    .then(response => {
        if (response.status === 200) {
            response.json().then(response => {
                localStorage.setItem('authUser', JSON.stringify(response));
                getFeedPage(true);
                clearLoginForm();
            })
            return Promise.resolve("hi");
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

/*
Clears the login form
*/
export function clearLoginForm() {
    loginform.email.value = "";
    loginform.pw.value = "";
}

/*
Logs the user in automatically if a token is in local storage
*/
if (localStorage.getItem("authUser")) {
    getFeedPage(true);
}