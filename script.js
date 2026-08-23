document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       FIXED NAVBAR ON SCROLL
    ========================= */

    const navWrapper = document.querySelector(".nav-wrapper");

    window.addEventListener("scroll", () => {
        if (!navWrapper) return;

        navWrapper.classList.toggle(
            "scrolled",
            window.scrollY > 50
        );
    });


    /* =========================
       MOBILE MENU
    ========================= */

    const menuBtn = document.getElementById("menuBtn");
    const navlinks = document.getElementById("navlinks");

    if (menuBtn && navlinks) {
        menuBtn.addEventListener("click", () => {
            navlinks.classList.toggle("active");
        });
    }


    /* =========================
       CLOSE MOBILE MENU
    ========================= */

    const navLinks = document.querySelectorAll(
        ".nav-link, .login-btn"
    );

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (navlinks) {
                navlinks.classList.remove("active");
            }
        });
    });


    /* =========================
       IMAGE UPLOAD PREVIEW
    ========================= */

    const imageInput = document.getElementById("image");
    const uploadArea = document.querySelector(".upload-area");

    if (imageInput && uploadArea) {

        imageInput.addEventListener("change", () => {

            const file = imageInput.files[0];

            if (!file) return;

            if (!file.type.startsWith("image/")) {
                alert("Please select a valid image file.");
                imageInput.value = "";
                return;
            }

            const imageUrl = URL.createObjectURL(file);

            const existingPreview =
                uploadArea.querySelector(".image-preview");

            if (existingPreview) {
                existingPreview.src = imageUrl;
            } else {

                const uploadContent =
                    uploadArea.querySelectorAll(
                        ".upload-icon, strong, span"
                    );

                uploadContent.forEach(element => {
                    element.style.display = "none";
                });

                const preview =
                    document.createElement("img");

                preview.src = imageUrl;
                preview.alt = "Issue preview";
                preview.classList.add("image-preview");

                const fileName =
                    document.createElement("div");

                fileName.classList.add(
                    "image-preview-name"
                );

                fileName.textContent = file.name;

                const changeText =
                    document.createElement("span");

                changeText.classList.add(
                    "change-image-text"
                );

                changeText.textContent =
                    "Click to change image";

                uploadArea.appendChild(preview);
                uploadArea.appendChild(fileName);
                uploadArea.appendChild(changeText);
            }

        });

    }


    /* =========================
       CURRENT LOCATION
    ========================= */

    const locationBtn =
        document.querySelector(".location-btn");

    const locationInput =
        document.getElementById("location");

    if (locationBtn && locationInput) {

        locationBtn.addEventListener("click", () => {

            if (!navigator.geolocation) {
                alert(
                    "Geolocation is not supported by your browser."
                );
                return;
            }

            const originalText =
                locationBtn.innerHTML;

            locationBtn.innerHTML =
                "<span>⌖</span> Getting Location...";

            locationBtn.disabled = true;

            navigator.geolocation.getCurrentPosition(

                position => {

                    const latitude =
                        position.coords.latitude;

                    const longitude =
                        position.coords.longitude;

                    locationInput.value =
                        `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

                    locationBtn.innerHTML =
                        "<span>✓</span> Location Added";

                    setTimeout(() => {
                        locationBtn.innerHTML =
                            originalText;

                        locationBtn.disabled = false;
                    }, 2000);

                },

                error => {

                    console.error(error);

                    let message =
                        "Unable to get your location.";

                    if (
                        error.code ===
                        error.PERMISSION_DENIED
                    ) {
                        message =
                            "Location permission was denied. Please enter your location manually.";
                    }

                    alert(message);

                    locationBtn.innerHTML =
                        originalText;

                    locationBtn.disabled = false;

                }

            );

        });

    }

});