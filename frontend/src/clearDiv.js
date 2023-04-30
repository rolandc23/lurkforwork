/*
clearDiv function removes any appended divs (children).
Functions as a container reset function.
*/

export function clearDiv(divId) {
    let div = document.getElementById(divId);
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
}