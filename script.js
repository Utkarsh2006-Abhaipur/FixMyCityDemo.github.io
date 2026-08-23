import { auth } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";


const ADMIN_EMAIL =
    "utkarshkumarabhaipur@gmail.com";


/* =========================
   MOBILE MENU
========================= */

const menuBtn =
    document.getElementById("menuBtn");

const navlinks =
    document.getElementById("navlinks");


if (menuBtn && navlinks) {

    menuBtn.setAttribute(
        "aria-expanded",
        "false"
    );


    menuBtn.addEventListener(
        "click",

        () => {

            const isOpen =
                navlinks.classList.toggle(
                    "active"
                );


            menuBtn.classList.toggle(
                "active",
                isOpen
            );


            menuBtn.setAttribute(
                "aria-expanded",
                isOpen
            );

        }

    );


    /*
       Close mobile menu
       after clicking a link/button
    */

    navlinks.addEventListener(
        "click",

        event => {

            if (
                event.target.closest(
                    "a, button"
                )
            ) {

                navlinks.classList.remove(
                    "active"
                );


                menuBtn.classList.remove(
                    "active"
                );


                menuBtn.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }

    );


    /*
       Close menu if screen
       becomes desktop size
    */

    window.addEventListener(
        "resize",

        () => {

            if (
                window.innerWidth > 768
            ) {

                navlinks.classList.remove(
                    "active"
                );


                menuBtn.classList.remove(
                    "active"
                );


                menuBtn.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }

    );

}


/* =========================
   NAVBAR SCROLL EFFECT
========================= */

const navWrapper =
    document.querySelector(
        ".nav-wrapper"
    );


if (navWrapper) {

    const updateNavbar = () => {

        if (
            window.scrollY > 30
        ) {

            navWrapper.classList.add(
                "scrolled"
            );

        }

        else {

            navWrapper.classList.remove(
                "scrolled"
            );

        }

    };


    window.addEventListener(
        "scroll",
        updateNavbar
    );


    updateNavbar();

}


/* =========================
   AUTHENTICATION NAVBAR
========================= */

onAuthStateChanged(
    auth,

    user => {

        const navList =
            document.querySelector(
                ".navlinks ul"
            );


        if (!navList) {
            return;
        }


        /*
           Remove previously generated
           authentication items
        */

        const existingAuthItem =
            document.getElementById(
                "authNavItem"
            );


        if (existingAuthItem) {

            existingAuthItem.remove();

        }


        const existingDashboard =
            document.getElementById(
                "dashboardNavItem"
            );


        if (existingDashboard) {

            existingDashboard.remove();

        }


        /* =========================
           LOGGED OUT
        ========================= */

        if (!user) {

            const loginItem =
                document.createElement(
                    "li"
                );


            loginItem.id =
                "authNavItem";


            loginItem.innerHTML = `
                <a
                    href="login.html"
                    class="login-btn"
                >
                    Login
                </a>
            `;


            navList.appendChild(
                loginItem
            );


            return;

        }


        /* =========================
           ADMIN DASHBOARD
        ========================= */

        if (
            user.email &&
            user.email.toLowerCase() ===
            ADMIN_EMAIL.toLowerCase()
        ) {

            const dashboardItem =
                document.createElement(
                    "li"
                );


            dashboardItem.id =
                "dashboardNavItem";


            dashboardItem.innerHTML = `
                <a
                    href="admin.html"
                    class="nav-link"
                >
                    Dashboard
                </a>
            `;


            navList.appendChild(
                dashboardItem
            );

        }


        /* =========================
           LOGOUT BUTTON
        ========================= */

        const logoutItem =
            document.createElement(
                "li"
            );


        logoutItem.id =
            "authNavItem";


        logoutItem.innerHTML = `
            <button
                type="button"
                class="login-btn logout-btn"
            >
                Logout
            </button>
        `;


        navList.appendChild(
            logoutItem
        );


        const logoutBtn =
            logoutItem.querySelector(
                ".logout-btn"
            );


        logoutBtn.addEventListener(
            "click",

            async () => {

                try {

                    logoutBtn.disabled =
                        true;


                    logoutBtn.textContent =
                        "Logging out...";


                    await signOut(auth);


                    window.location.href =
                        "index.html";

                }

                catch (error) {

                    console.error(
                        "Logout error:",
                        error
                    );


                    alert(
                        "Unable to logout. Please try again."
                    );


                    logoutBtn.disabled =
                        false;


                    logoutBtn.textContent =
                        "Logout";

                }

            }

        );

    }

);