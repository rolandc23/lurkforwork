import { BACKEND_PORT } from './config.js';
import { displayPopup } from './popup.js';
import { getAuthUser } from './getAuthDetails.js';
import { getLoginPage } from './getPage.js';

/*
Gets the details of a user
*/
export function getUserDeets(userId) {
    const authUser = getAuthUser();
    return fetch(`http://localhost:${BACKEND_PORT}/user?userId=${userId}`, {
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
            const error = "User does not exist, or it does not match with the given email";
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
    });
}