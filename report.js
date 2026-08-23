import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


/* =========================
   CLOUDINARY CONFIGURATION
========================= */

const CLOUDINARY_CLOUD_NAME = "ecuzu6gw";

const CLOUDINARY_UPLOAD_PRESET =
    "citycare_issues";


/* =========================
   ELEMENTS
========================= */

const issueForm =
    document.getElementById("issueForm");

const imageInput =
    document.getElementById("image");

const submitButton =
    document.querySelector(".submit-issue-btn");


/* =========================
   CLOUDINARY IMAGE UPLOAD
========================= */

async function uploadImageToCloudinary(file) {

    const uploadUrl =
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;


    const formData = new FormData();

    formData.append(
        "file",
        file
    );

    formData.append(
        "upload_preset",
        CLOUDINARY_UPLOAD_PRESET
    );


    const response =
        await fetch(
            uploadUrl,
            {
                method: "POST",
                body: formData
            }
        );


    /* GET ACTUAL ERROR FROM CLOUDINARY */

    const data =
        await response.json();


    if (!response.ok) {

        console.error(
            "Cloudinary Error:",
            data
        );

        throw new Error(
            data?.error?.message ||
            "Cloudinary image upload failed."
        );
    }


    console.log(
        "Cloudinary Upload Success:",
        data
    );


    return {

        imageUrl:
            data.secure_url,

        publicId:
            data.public_id

    };

}


/* =========================
   FORM SUBMISSION
========================= */

if (issueForm) {

    issueForm.addEventListener(
        "submit",

        async (event) => {

            event.preventDefault();


            const originalButtonText =
                submitButton.innerHTML;


            /* =========================
               GET FORM VALUES
            ========================= */

            const title =
                document
                    .getElementById("title")
                    .value
                    .trim();


            const category =
                document
                    .getElementById("category")
                    .value;


            const description =
                document
                    .getElementById("description")
                    .value
                    .trim();


            const location =
                document
                    .getElementById("location")
                    .value
                    .trim();


            const imageFile =
                imageInput.files[0];


            /* =========================
               VALIDATION
            ========================= */

            if (
                !title ||
                !category ||
                !description ||
                !location
            ) {

                alert(
                    "Please fill in all required fields."
                );

                return;

            }


            try {

                /* =========================
                   BUTTON LOADING STATE
                ========================= */

                submitButton.disabled = true;

                submitButton.innerHTML =
                    "Submitting...";


                let imageUrl = "";

                let imagePublicId = "";


                /* =========================
                   UPLOAD IMAGE
                ========================= */

                if (imageFile) {

                    console.log(
                        "Starting Cloudinary upload..."
                    );


                    submitButton.innerHTML =
                        "Uploading Image...";


                    const uploadedImage =
                        await uploadImageToCloudinary(
                            imageFile
                        );


                    imageUrl =
                        uploadedImage.imageUrl;


                    imagePublicId =
                        uploadedImage.publicId;


                    console.log(
                        "Image uploaded successfully:",
                        imageUrl
                    );

                }


                /* =========================
                   SAVE TO FIRESTORE
                ========================= */

                submitButton.innerHTML =
                    "Saving Report...";


                const issueId =
                    `CC-${Date.now()}`;


                console.log(
                    "Saving report to Firestore..."
                );


                const docRef =
                    await addDoc(

                        collection(
                            db,
                            "issues"
                        ),

                        {

                            issueId:
                                issueId,

                            title:
                                title,

                            category:
                                category,

                            description:
                                description,

                            location:
                                location,


                            imageUrl:
                                imageUrl,

                            imagePublicId:
                                imagePublicId,


                            status:
                                "Submitted",


                            createdAt:
                                serverTimestamp()

                        }

                    );


                console.log(
                    "Firestore Success!"
                );


                console.log(
                    "Document ID:",
                    docRef.id
                );


                /* =========================
                   SUCCESS
                ========================= */

                submitButton.innerHTML =
                    "Report Submitted ✓";


                alert(
                    `Report submitted successfully!\n\nTracking ID: ${issueId}`
                );


                issueForm.reset();


                /* =========================
                   REDIRECT TO TRACK PAGE
                ========================= */

                setTimeout(() => {

                    window.location.href =
                        `track.html?id=${issueId}`;

                }, 1000);


            } catch (error) {


                /* =========================
                   SHOW ACTUAL ERROR
                ========================= */

                console.error(
                    "FULL ERROR:",
                    error
                );


                console.error(
                    "Error Code:",
                    error.code
                );


                console.error(
                    "Error Message:",
                    error.message
                );


                alert(

                    "Report submission failed.\n\n" +

                    "Error: " +

                    (
                        error.message ||
                        "Unknown error"
                    )

                );


                submitButton.innerHTML =
                    originalButtonText;


                submitButton.disabled =
                    false;

            }

        }

    );

}