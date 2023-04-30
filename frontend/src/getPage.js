import { handleFeed } from './feed.js';
import { handleProfile } from './profile.js';
import { makeEditProfile } from './editProfile.js';
import { makeAddJob } from './job.js';
import { makeAddBtn } from './watch.js';
import { getAuthUser } from './getAuthDetails.js';
import { getMaxHeight } from './height.js';
import { makeForgotPwForm, clearForgotPwForm } from './forgotPw.js';
import { clearDiv } from './clearDiv.js';
import { clearRegisterForm } from './register.js';
import { clearLoginForm } from './login.js';

/*
Creates the register page by hiding the login page
*/
export function getRegisterPage() {
    document.getElementById('registerpage').classList.remove('hidden');
    document.getElementById('loginpage').classList.add('hidden');
    document.getElementById("searchbar").classList.add("hidden");
    closeForgotPwForm();
}

/*
Creates the login page by hiding register and other elements
*/
export function getLoginPage() {
    clearDiv("userList")
    clearDiv("loggedInIcons");
    clearRegisterForm();
    document.getElementById("searchbar").classList.add("hidden");
    document.getElementById("homeBtn").disabled = true;
    document.getElementById('registerpage').classList.add('hidden');
    document.getElementById('loginpage').classList.remove('hidden');
    document.getElementById('feedpage').classList.add('hidden');
    document.getElementById('editprofilepage').classList.add('hidden');
    document.getElementById('headerLogin').classList.remove('hidden');
    document.getElementById('headerSignUp').classList.remove('hidden');
    document.getElementById('profilepage').classList.add('hidden');
    document.getElementById('addjobpostMain').classList.add('hidden');
    document.getElementById('addemailMain').classList.add('hidden');
    closeForgotPwForm();
}

/*
Loads the feed page and shows the 
elements necessary for the feed
*/
export function getFeedPage(fromLogin) {
    clearRegisterForm();
    clearLoginForm();
    document.getElementById("homeBtn").disabled = true;
    document.getElementById('feedpage').classList.remove('hidden');
    document.getElementById("searchbar").classList.remove("hidden");
    document.getElementById('loginpage').classList.add('hidden');
    document.getElementById('registerpage').classList.add('hidden');
    document.getElementById('editprofilepage').classList.add('hidden');
    document.getElementById('headerLogin').classList.add('hidden');
    document.getElementById('headerSignUp').classList.add('hidden');
    document.getElementById('addjobpostMain').classList.add('hidden');
    if (!fromLogin) {
        document.getElementById('addjobbtn').disabled = false;
        document.getElementById("imageBtn").disabled = false;
    }
    handleFeed(fromLogin);
}


/*
Handles the transition from a page to a profile page
*/
export function getProfilePage(profileId) {
    document.getElementById("searchbar").classList.add("hidden");
    const authUser = getAuthUser();
    if (profileId === authUser.userId) {
        document.getElementById("imageBtn").disabled = true;
    } else {
        document.getElementById("imageBtn").disabled = false;
    }
    document.getElementById('feedpage').classList.add('hidden');
    document.getElementById('editprofilepage').classList.add('hidden');
    document.getElementById('profilepage').classList.remove('hidden');
    document.getElementById('addjobpostMain').classList.add('hidden');
    document.getElementById('addjobbtn').disabled = false;
    handleProfile(profileId);
}

/*
Handles the transition from the profile page to
the edit profile form
*/
export function getEditPage(profile) {
    document.getElementById("searchbar").classList.add("hidden");
    document.getElementById("imageBtn").disabled = false;
    document.getElementById('feedpage').classList.add('hidden');
    document.getElementById('profilepage').classList.add('hidden');
    document.getElementById('addjobpostMain').classList.add('hidden');
    document.getElementById('editprofilepage').classList.remove('hidden');
    document.getElementById('addjobbtn').disabled = false;
    resetEditPage();
    makeEditProfile(profile);
}

/*
Opens the popup to add a new job
*/
export function openAddJobPostPopup(type, post) {
    let height = getMaxHeight();
    document.getElementById('addjobbtn').disabled = true;
    document.getElementById('addemailbtn').disabled = true;
    document.getElementById('addjobpostMain').classList.remove('hidden');
    document.getElementById('addjobpostMain').style.height = `${height}px`;
    makeAddJob(type, post);
}

/*
Closes the new job popup
*/
export function closeAddJobPostPopup() {
    document.getElementById('addjobbtn').disabled = false;
    document.getElementById('addemailbtn').disabled = false;
    document.getElementById('addjobpostMain').classList.add('hidden');
    clearDiv('jobAction');
}

/*
Opens the email popup
*/
export function openAddEmailPopup() {
    let height = getMaxHeight();
    document.getElementById('addjobbtn').disabled = true;
    document.getElementById('addemailbtn').disabled = true;
    document.getElementById('addemailMain').classList.remove('hidden');
    document.getElementById('addemailMain').style.height = `${height}px`;
    makeAddBtn();
}

/*
Closes the email popup
*/
export function closeAddEmailPopup() {
    document.getElementById('addjobbtn').disabled = false;
    document.getElementById('addemailbtn').disabled = false;
    document.getElementById('addemailMain').classList.add('hidden');
    clearDiv('addEmailContainer');
}

/*
Resets the edit profile page form
*/
function resetEditPage() {
    editprofileform.reset();
    document.getElementById('invalideditemail').classList.add('hidden');
    document.getElementById('invalideditnameshort').classList.add('hidden');
    document.getElementById('invalideditnamelong').classList.add('hidden');
    document.getElementById('invalideditpw').classList.add('hidden');
    document.getElementById('editpwnotmatching').classList.add('hidden');
    document.getElementById('invalidfile').classList.add('hidden');
    clearDiv("resetBtnContainer");
};

/*
Creates forgot password form
*/
export function getForgotPwForm() {
    let height = getMaxHeight();
    document.getElementById("headerSignUp").disabled = true;
    document.getElementById("headerLogin").disabled = true;
    document.getElementById('forgotPwForm').classList.remove('hidden');
    document.getElementById('forgotPwForm').style.height = `${height}px`;
    makeForgotPwForm();
}

/*
Closes forgot password form
*/
export function closeForgotPwForm() {
    clearDiv("forgotpwbuttondiv");
    clearForgotPwForm();
    document.getElementById("headerSignUp").disabled = false;
    document.getElementById("headerLogin").disabled = false;
    document.getElementById('forgotPwForm').classList.add('hidden');
}

