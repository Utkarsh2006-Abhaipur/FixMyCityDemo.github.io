import { auth } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";


const ADMIN_EMAIL =
    "utkarshkumarabhaipur@gmail.com";


onAuthStateChanged(auth, user => {

    /*
       No logged-in user
    */

    if (!user) {

        window.location.href =
            "login.html";

        return;
    }


    /*
       Logged in, but not admin
    */

    if (
        user.email.toLowerCase() !==
        ADMIN_EMAIL.toLowerCase()
    ) {

        alert(
            "You are not authorized to access the Admin Dashboard."
        );

        window.location.href =
            "index.html";

        return;
    }


    /*
       Authorized admin
    */

    console.log(
        "Admin access granted:",
        user.email
    );

});