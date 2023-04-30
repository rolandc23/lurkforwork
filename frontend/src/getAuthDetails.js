/*
Gets the stored token of the logged in user
*/
export function getAuthUser() {
    return JSON.parse(localStorage.getItem("authUser"));
}