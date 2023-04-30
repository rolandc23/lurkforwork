/*
Check.js
    Contains check functions for variety of forms.
*/

export function checkEmail(form, invalidEmailId) {
    let validEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!form.email.value.match(validEmail)) {
        document.getElementById(invalidEmailId).classList.remove('hidden');
    } else {
        document.getElementById(invalidEmailId).classList.add('hidden');
    }
    return (form.email.value.match(validEmail));
}

export function checkPassword(form, invalidPwId) {
    if (form.pw.value.length < 6) {
        document.getElementById(invalidPwId).classList.remove('hidden');
    } else {
        document.getElementById(invalidPwId).classList.add('hidden');
    }
    return (form.pw.value.length >= 6);
}

export function checkName(form, invalidShortId, invalidLongId) {
    if (form.name.value.length < 2) {
        document.getElementById(invalidShortId).classList.remove('hidden');
        document.getElementById(invalidLongId).classList.add('hidden');
    } else if (form.name.value.length > 100) {
        document.getElementById(invalidLongId).classList.remove('hidden');
        document.getElementById(invalidShortId).classList.add('hidden');
    } else {
        document.getElementById(invalidLongId).classList.add('hidden');
        document.getElementById(invalidShortId).classList.add('hidden');
    }
    return (form.name.value.length >= 2 && form.name.value.length <= 100);
}

export function checkConfirmPassword(form, invalidConfirmPwId) {
    if (form.pw.value != form.confirmpw.value) {
        document.getElementById(invalidConfirmPwId).classList.remove('hidden');
    } else {
        document.getElementById(invalidConfirmPwId).classList.add('hidden');
    }
    return (form.pw.value === form.confirmpw.value);
}

export function checkEditImage(source) {
    if (!editprofileform.uploadfile.value) {
        document.getElementById('resetBtn').disabled = true;
    } else {
        document.getElementById('resetBtn').disabled = false;
    }
    if (source === "invalid") {
        document.getElementById('invalidfile').classList.remove('hidden');
    } else {
        document.getElementById('invalidfile').classList.add('hidden');
    }
    return (source !== "invalid");
}

export function checkJobTitle() {
    if (addjobpost.addjobtitle.value.length === 0) {
        document.getElementById('invalidjobtitle').classList.remove('hidden');
    } else {
        document.getElementById('invalidjobtitle').classList.add('hidden');
    }
    return (addjobpost.addjobtitle.value.length > 0);
}

export function checkStartDate() {
    if (!addjobpost.editdate.value) {
        document.getElementById('invaliddate').classList.remove('hidden');
    } else {
        document.getElementById('invaliddate').classList.add('hidden');
    }
    return (addjobpost.editdate.value);
}

export function checkJobDesc() {
    if (document.getElementById('editjobdesc').value.length === 0) {
        document.getElementById('invalidjobdesc').classList.remove('hidden');
    } else {
        document.getElementById('invalidjobdesc').classList.add('hidden');
    }
    return (document.getElementById('editjobdesc').value.length > 0);
}

export function checkImage(source) {
    if (!source) {
        document.getElementById('invalidjobfile').classList.remove('hidden');
    } else {
        document.getElementById('invalidjobfile').classList.add('hidden');
    }
    return (source);
}

export function checkId() {
    let validId = /^[0-9]+$/;
    if (!forgotpwform.id.value.match(validId)) {
        document.getElementById('invalidforgotpwid').classList.remove('hidden');
    } else {
        document.getElementById('invalidforgotpwid').classList.add('hidden');
    }
    return (forgotpwform.id.value.match(validId));
}
