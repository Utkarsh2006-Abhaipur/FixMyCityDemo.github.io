import { auth } from "./firebase.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";


const ADMIN_EMAIL =
    "utkarshkumarabhaipur@gmail.com";


const authForm =
    document.getElementById("authForm");

const authEmail =
    document.getElementById("authEmail");

const authPassword =
    document.getElementById("authPassword");

const authSubmitBtn =
    document.getElementById("authSubmitBtn");

const roleButtons =
    document.querySelectorAll(".role-btn");

const authTitle =
    document.getElementById("authTitle");

const authSubtitle =
    document.getElementById("authSubtitle");

const citizenAuthSwitch =
    document.getElementById("citizenAuthSwitch");

const authSwitchText =
    document.getElementById("authSwitchText");

const authSwitchBtn =
    document.getElementById("authSwitchBtn");

const adminLoginNote =
    document.getElementById("adminLoginNote");

const togglePassword =
    document.getElementById("togglePassword");


let selectedRole = "citizen";

let isSignupMode = false;


/* =========================
   ROLE SWITCHING
========================= */

roleButtons.forEach(button => {

    button.addEventListener(
        "click",

        () => {

            selectedRole =
                button.dataset.role;


            roleButtons.forEach(btn => {

                btn.classList.remove(
                    "active"
                );

            });


            button.classList.add(
                "active"
            );


            /*
               ADMIN MODE
            */

            if (
                selectedRole === "admin"
            ) {

                isSignupMode = false;


                authTitle.textContent =
                    "Admin Portal";


                authSubtitle.textContent =
                    "Sign in with your authorized administrator account.";


                authSubmitBtn.textContent =
                    "Login as Admin";


                citizenAuthSwitch.style.display =
                    "none";


                adminLoginNote.style.display =
                    "block";

            }


            /*
               CITIZEN MODE
            */

            else {

                authTitle.textContent =
                    isSignupMode
                        ? "Create Your Account"
                        : "Welcome Back";


                authSubtitle.textContent =
                    isSignupMode
                        ? "Create an account to access CityCare services."
                        : "Sign in to continue to CityCare.";


                authSubmitBtn.textContent =
                    isSignupMode
                        ? "Create Account"
                        : "Login";


                citizenAuthSwitch.style.display =
                    "flex";


                adminLoginNote.style.display =
                    "none";

            }

        }

    );

});


/* =========================
   SIGNUP / LOGIN SWITCH
========================= */

authSwitchBtn.addEventListener(
    "click",

    () => {

        isSignupMode =
            !isSignupMode;


        if (isSignupMode) {

            authTitle.textContent =
                "Create Your Account";


            authSubtitle.textContent =
                "Join CityCare and help improve your city.";


            authSubmitBtn.textContent =
                "Create Account";


            authSwitchText.textContent =
                "Already have an account?";


            authSwitchBtn.textContent =
                "Login";

        }

        else {

            authTitle.textContent =
                "Welcome Back";


            authSubtitle.textContent =
                "Sign in to continue to CityCare.";


            authSubmitBtn.textContent =
                "Login";


            authSwitchText.textContent =
                "Don't have an account?";


            authSwitchBtn.textContent =
                "Create Account";

        }

    }

);


/* =========================
   SHOW / HIDE PASSWORD
========================= */

togglePassword.addEventListener(
    "click",

    () => {

        if (
            authPassword.type === "password"
        ) {

            authPassword.type =
                "text";


            togglePassword.textContent =
                "Hide";

        }

        else {

            authPassword.type =
                "password";


            togglePassword.textContent =
                "Show";

        }

    }

);


/* =========================
   AUTHENTICATION
========================= */

authForm.addEventListener(
    "submit",

    async event => {

        event.preventDefault();


        const email =
            authEmail.value
                .trim()
                .toLowerCase();


        const password =
            authPassword.value;


        const originalButtonText =
            authSubmitBtn.textContent;


        try {

            authSubmitBtn.disabled =
                true;


            authSubmitBtn.textContent =
                "Please wait...";


            /* =========================
               ADMIN LOGIN
            ========================= */

            if (
                selectedRole === "admin"
            ) {

                if (
                    email !== ADMIN_EMAIL
                ) {

                    throw new Error(
                        "This email is not authorized for admin access."
                    );

                }


                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


                window.location.href =
                    "admin.html";


                return;

            }


            /* =========================
               CITIZEN SIGNUP
            ========================= */

            if (
                isSignupMode
            ) {

                const userCredential =
                    await createUserWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );


                console.log(
                    "Citizen account created:",
                    userCredential.user.uid
                );


                alert(
                    "Account created successfully!"
                );


                window.location.href =
                    "index.html";

            }


            /* =========================
               CITIZEN LOGIN
            ========================= */

            else {

                const userCredential =
                    await signInWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );


                console.log(
                    "Citizen logged in:",
                    userCredential.user.uid
                );


                window.location.href =
                    "index.html";

            }

        }


        catch (error) {

            console.error(
                "Authentication error:",
                error
            );


            let message =
                "Authentication failed. Please try again.";


            switch (
                error.code
            ) {

                case "auth/email-already-in-use":

                    message =
                        "An account already exists with this email.";

                    break;


                case "auth/invalid-email":

                    message =
                        "Please enter a valid email address.";

                    break;


                case "auth/weak-password":

                    message =
                        "Password should contain at least 6 characters.";

                    break;


                case "auth/invalid-credential":

                    message =
                        "Incorrect email or password.";

                    break;


                case "auth/user-not-found":

                    message =
                        "No account found with this email.";

                    break;


                case "auth/wrong-password":

                    message =
                        "Incorrect password.";

                    break;

            }


            if (
                error.message ===
                "This email is not authorized for admin access."
            ) {

                message =
                    error.message;

            }


            alert(message);

        }


        finally {

            authSubmitBtn.disabled =
                false;


            authSubmitBtn.textContent =
                originalButtonText;

        }

    }

);