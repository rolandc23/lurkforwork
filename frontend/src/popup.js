/*
Creates popups used for errors, forms, alerts
*/
export function displayPopup(message) {
    let height = Math.max( document.body.scrollHeight, document.body.offsetHeight, 
        document.documentElement.clientHeight, document.documentElement.scrollHeight,
        document.documentElement.offsetHeight );
    document.getElementById('popupMain').style.height = `${height}px`;
    document.getElementById("popupMain").classList.remove('hidden');
    document.getElementById("popupMessage").textContent = message;
}
