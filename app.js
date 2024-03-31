import {
    auth,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    setDoc,
    db,
    doc,
    updatePassword,
    getDoc,
    updateEmail,
    uploadBytesResumable,
    getDownloadURL,
    ref,
    storage,
    deleteUser,
    signOut,
    sendPasswordResetEmail,
} from "./firebase.js";


//Check user login or not
onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
        console.log("Login hy!", user);
        heading.innerHTML = "User is login."
    } else {
        console.log("Please login.");
        heading.innerHTML = "Please login."
    }
});


//Register-Yourslef
const signup = () => {
    let nameS = document.getElementById("nameS").value;
    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let emailS = document.getElementById("emailS").value;
    let passwordS = document.getElementById("passwordS").value;
    let passwordRegex = /^(?=.*[!@#$%^&*()-_+=])[0-9!@#$%^&*()-_+=]{6,10}$/;
    let cPasswordS = document.getElementById("cPasswordS").value;
    console.log(nameS, emailS, passwordS, cPasswordS);
    if (nameS === "") {
        alert("Please type name.");
    } else if (emailS === "") {
        alert("Please type email.");
    } else if (!emailRegex.test(emailS) === "") {
        alert("Please type email.");
    } else if (passwordS === "") {
        alert("Please type password.");
    } else if (!passwordRegex.test(passwordS) === "") {
        alert("Password minmum 6 characters and only digits and at least one special character. Maximum length is 10 characters.");
    } else if (cPasswordS === "") {
        alert("Please confirm password.");
    } else if (passwordS !== cPasswordS) {
        alert("Please match password.");
    } else {
        createUserWithEmailAndPassword(auth, emailS, passwordS)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log("user--->", user);
                alert("Registered Successfully.");
                signupModalCloseBtn.click();
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                if (errorCode === "auth/email-already-in-use") {
                    alert("Email already registered.");
                }
            });
        document.getElementById("nameS").value = "";
        document.getElementById("emailS").value = "";
        document.getElementById("passwordS").value = "";
        document.getElementById("cPasswordS").value = "";
    }
}
const signupBtn = document.getElementById("signupBtn");
signupBtn.addEventListener("click", signup);

//Login User
const login = () => {
    let emailL = document.getElementById("emailL").value;
    let passwordL = document.getElementById("passwordL").value;
    if (emailL === "") {
        alert("Please type email.");
    } else if (passwordL === "") {
        alert("Please retype password.");
    } else {
        signInWithEmailAndPassword(auth, emailL, passwordL)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log("user--->", user);
                alert("Login Successfully.");
                loginModalCloseBtn.click();
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert("Invalid email or password.");
                console.log("error--->", errorCode);
            });
    }
}
const loginBtn = document.getElementById("loginBtn");
loginBtn.addEventListener("click", login);

let file;
//Edit profile 
const editProfile = async () => {
    let editName = document.getElementById("editName").value;
    let editEmail = document.getElementById("editEmail").value;

    let editContactNumber = document.getElementById("editContactNumber").value;
    let editDob = document.getElementById("editDob").value;
    let editGender = document.getElementById("editGender").value;
    let editFood = document.getElementById("editFood").value;
    let editAddress = document.getElementById("editAddress").value;
    let editCountryName = document.getElementById("editCountryName").value;
    let editCity = document.getElementById("editCity").value;
    const user = auth.currentUser;
    let uid = user.uid;
    if (editName === "") {
        alert("Please type your name.");
    } else if (editEmail === "") {
        alert("Please type your email.");
    } else if (editContactNumber === "") {
        alert("Please type contact number.")
    } else if (editDob === "") {
        alert("Please type date of birth.")
    } else if (editGender === "") {
        alert("Please type your gender.")
    } else if (editFood === "") {
        alert("Please type your favourite food.")
    } else if (editCountryName === "") {
        alert("Please type country name.")
    } else if (editAddress === "") {
        alert("Please type address.")
    } else if (editCity === "") {
        alert("Please type your city.")
    } else {
        await setDoc(doc(db, "usersData", `${uid}`), {
            editName,
            editEmail,
            editContactNumber,
            editDob,
            editGender,
            editFood,
            editCountryName,
            editAddress,
            editCity,
            uid,
        });
        if (!file) {
            alert("Please provide picture.")
        } else if (file) {
            await uploadFile();
            document.getElementById("editName").value = "";
            document.getElementById("editEmail").value = "";
            document.getElementById("editContactNumber").value = "";
            document.getElementById("editDob").value = "";
            document.getElementById("editGender").value = "";
            document.getElementById("editAddress").value = "";
            document.getElementById("editFood").value = "";
            document.getElementById("editCountryName").value = "";
            document.getElementById("editAddress").value = "";
            document.getElementById("editCity").value = "";
        }
    }
}
const editModalBtn = document.getElementById("editModalBtn");
editModalBtn.addEventListener("click", editProfile);

//View Data
const viewData = async () => {
    let viewName = document.getElementById("viewName");
    let originalEmail = document.getElementById("originalEmail");
    let viewEmail = document.getElementById("viewEmail");
    let viewContactNumber = document.getElementById("viewContactNumber");
    let viewDob = document.getElementById("viewDob");
    let viewGender = document.getElementById("viewGender");
    let viewFood = document.getElementById("viewFood");
    let viewAddress = document.getElementById("viewAddress");
    let viewCountryName = document.getElementById("viewCountryName");
    let viewCity = document.getElementById("viewCity");
    let loader = document.getElementById("loader");
    let viewProfileModalBody = document.getElementById("viewProfileModalBody");
    loader.style.display = "";
    const user = auth.currentUser;
    let uid = user.uid;
    const docRef = doc(db, "usersData", `${uid}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        let {
            editName,
            editEmail,
            editContactNumber,
            editDob,
            editGender,
            editFood,
            editCountryName,
            editAddress,
            editCity,
        } = docSnap.data();
        loader.style.display = "none";
        viewProfileModalBody.style.display = "block";
        gettingPic();
        viewName.value = `Name: ${editName}`;
        originalEmail.value = `Registered-Email: ${user.email}`;
        viewEmail.value = `Provided Email: ${editEmail}`;
        viewContactNumber.value = `Contact-Number: ${editContactNumber}`;
        viewDob.value = `DOB: ${editDob}`;
        viewGender.value = `Gender-Identity: ${editGender}`;
        viewFood.value = `Food-Name: ${editFood}`;
        viewAddress.value = `Address ${editCountryName}`;
        viewCountryName.value = `Country-Name: ${editAddress}`;
        viewCity.value = `City-Name: ${editCity}`;
    } else {
        loader.style.display = "none";
        viewModalText.innerHTML = "No data has been given.";
    }
}
const viewProfileBtn = document.getElementById("viewProfileBtn");
viewProfileBtn.addEventListener("click", viewData);

//Getting old email
const accountSettings = () => {
    let oldEmail = document.getElementById("oldEmail");
    gettingPic();
    const user = auth.currentUser;
    oldEmail.value = user.email;
}
const accountSettingsBtn = document.getElementById("privacySettingsBtn");
accountSettingsBtn.addEventListener("click", accountSettings);

//Select Show Pic
const selectShowPic = () => {
    let userPhotoUpload = document.getElementById("userPhotoUpload");
    let inputFile = document.getElementById("inputFile");
    userPhotoUpload.addEventListener("click", function () {
        inputFile.click();
    })
    inputFile.onchange = function () {
        file = inputFile.files[0];
        userPhotoUpload.src = URL.createObjectURL(file);
        console.log(file);
    };
}
selectShowPic();

//Upload File
const uploadFile = async () => {
    if (file.size > 1572864) {
        alert("Picture must be less than 1.5Mb.");
        return;
    }
    // //File type validation
    // const fileTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
    // if (!fileTypes.includes(file.type)) {
    //     alert("Please select JPG,JPEG or PNG.");
    //     return;
    // }
    const authCurrentUserUid = auth.currentUser.uid;
    const storageRef = ref(storage, `usersImages/${authCurrentUserUid}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    await uploadTask.on('state_changed',
        (snapshot) => {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            console.log("Please wait your picture is saving. " + progress + "%");
        },
        (error) => {
            console.log("error", error);
        }, () => {
            getDownloadURL(uploadTask.snapshot.ref)
                .then((downloadURL) => {
                    const imageUrl = downloadURL;
                    const authCurrentUserUid = auth.currentUser.uid;
                    setDoc(doc(db, "usersImages", `${authCurrentUserUid}`), {
                        userImageUrl: `${imageUrl}`,
                    });
                    alert("Provided data has been saved.");
                    editModalCloseBtn.click();
                })
                .catch(error => {
                    console.log("Try again.");
                })
        }
    )
}

//Getting Pic
const gettingPic = async () => {
    let userPhotoView = document.getElementById("userPhotoView");
    let userPhotoprivacy = document.getElementById("userPhotoprivacy");
    const user = auth.currentUser;
    let uid = user.uid;
    const docRef = doc(db, "usersImages", `${uid}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        let {
            userImageUrl
        } = docSnap.data();
        userPhotoView.src = userImageUrl;
        userPhotoprivacy.src = userImageUrl;
    } else {

    }
};

//Update Password
const editPassword = async () => {
    const newPassword = document.getElementById("newPassword").value;
    let passwordRegex = /^(?=.*[!@#$%^&*()-_+=])[0-9!@#$%^&*()-_+=]{6,10}$/;
    const user = auth.currentUser;
    if (newPassword === "") {
        alert("Please provide new password.");
    } else if (!passwordRegex.test(newPassword)) {
        alert("Password minmum 6 characters and only digits and at least one special character. Maximum length is 10 characters.");
    } else {
        await updatePassword(user, newPassword).then(() => {
            alert("Password Updated!");
            privacySettingsCloseBtn.click();
        }).catch((error) => {
            alert("Try again.")
        });
    }
}
const updatePasswordBtn = document.getElementById("updatePasswordBtn");
updatePasswordBtn.addEventListener("click", editPassword);

//Update email
const editEmail = async () => {
    const newEmail = document.getElementById("newEmail").value;
    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const user = auth.currentUser;
    if (newEmail === "") {
        alert("Please provide email.");
    } else if (!emailRegex.test(newEmail)) {
        alert("Invalid email.");
    } else {
        await updateEmail(user, newEmail).then(() => {
            alert("Email updated");
            privacySettingsCloseBtn.click();
        }).catch((error) => {
            alert("Please try again. An error occured.");
        });
    }
}
const updatEmailBtn = document.getElementById("updateEmailBtn");
updatEmailBtn.addEventListener("click", editEmail);


const deletAccount = () => {
    const user = auth.currentUser;
    deleteUser(user).then(() => {
        alert("Account deleted successfully.");
    }).catch((error) => {
        alert("Please try again.");
    });
}

const delAccountBtn = document.getElementById("delAccountBtn");
delAccountBtn.addEventListener("click", deletAccount);

const logout = () => {
    signOut(auth).then(() => {
        alert("Sign-out successful.");
    }).catch((error) => {
        console.log("An error happened.");
    });

}

const logoutBtn = document.getElementById("logoutBtn");
logoutBtn.addEventListener("click", logout);

const resetPassword = () => {
    const user = auth.currentUser;
    sendPasswordResetEmail(auth, user.email)
        .then(() => {
            alert("Please goto inbox.")
        })
        .catch((error) => {
            const errorMessage = error.message;
            const errorCode = error.code;
            alert("Try again.");
        });
}

const resetPasswordBtn = document.getElementById("resetPasswordBtn");
resetPasswordBtn.addEventListener("click", resetPassword);