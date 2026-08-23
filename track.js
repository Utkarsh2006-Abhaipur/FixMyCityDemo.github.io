import { db } from "./firebase.js";
import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const trackingIdInput = document.getElementById("trackingId");
const trackBtn = document.getElementById("trackBtn");

const trackEmpty = document.getElementById("trackEmpty");
const reportResultCard = document.getElementById("reportResultCard");
const trackNotFound = document.getElementById("trackNotFound");

function resetResults() {
    trackEmpty.classList.remove("show");
    reportResultCard.classList.remove("show");
    trackNotFound.classList.remove("show");
}

function formatDate(timestamp) {
    if (!timestamp) {
        return "Recently submitted";
    }

    const date = timestamp.toDate();

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit"
    });
}

function updateTimeline(status) {
    const steps = [
        "Submitted",
        "Under Review",
        "In Progress",
        "Resolved"
    ];

    const currentIndex = steps.indexOf(status);

    document.querySelectorAll(".timeline-step").forEach((step, index) => {
        step.classList.remove("active");

        if (index <= currentIndex) {
            step.classList.add("active");
        }
    });
}

function updateStatusBadge(status) {
    const statusBadge = document.getElementById("statusBadge");

    statusBadge.textContent = status;

    statusBadge.className = "status-badge";

    const normalizedStatus = status
        .toLowerCase()
        .replace(/\s+/g, "-");

    statusBadge.classList.add(
        `status-${normalizedStatus}`
    );
}

async function trackIssue() {
    const trackingId =
        trackingIdInput.value.trim();

    if (!trackingId) {
        alert("Please enter your Tracking ID.");
        return;
    }

    const originalButtonText =
        trackBtn.innerHTML;

    try {
        resetResults();

        trackBtn.disabled = true;
        trackBtn.textContent = "Searching...";

        const issuesRef =
            collection(db, "issues");

        const issueQuery =
            query(
                issuesRef,
                where(
                    "issueId",
                    "==",
                    trackingId
                )
            );

        const querySnapshot =
            await getDocs(issueQuery);

        if (querySnapshot.empty) {
            trackNotFound.classList.add("show");
            return;
        }

        const issueData =
            querySnapshot.docs[0].data();

        document.getElementById(
            "resultTrackingId"
        ).textContent =
            issueData.issueId || "--";

        document.getElementById(
            "resultCategory"
        ).textContent =
            issueData.category || "Not specified";

        document.getElementById(
            "resultDescription"
        ).textContent =
            issueData.description || "No description provided.";

        document.getElementById(
            "resultLocation"
        ).textContent =
            issueData.location || "Location not provided.";

        document.getElementById(
            "resultDate"
        ).textContent =
            formatDate(issueData.createdAt);

        document.getElementById(
            "resultStatus"
        ).textContent =
            issueData.status || "Submitted";

        updateStatusBadge(
            issueData.status || "Submitted"
        );

        updateTimeline(
            issueData.status || "Submitted"
        );

        const resultImage =
            document.getElementById("resultImage");

        const noImage =
            document.getElementById("noImage");

        if (issueData.imageUrl) {
            resultImage.src =
                issueData.imageUrl;

            resultImage.classList.add("show");

            noImage.style.display =
                "none";
        } else {
            resultImage.src = "";

            resultImage.classList.remove("show");

            noImage.style.display =
                "flex";
        }

        reportResultCard.classList.add("show");

    } catch (error) {
        console.error(
            "Tracking error:",
            error
        );

        alert(
            "Unable to retrieve the report. Please try again."
        );

        trackNotFound.classList.add("show");

    } finally {
        trackBtn.disabled = false;

        trackBtn.innerHTML =
            originalButtonText;
    }
}

trackBtn.addEventListener(
    "click",
    trackIssue
);

// trackingIdInput.addEventListener(
//     "keydown",
//     event => {
//         if (event.key === "Enter") {
//             trackIssue();
//         }
//     }
// );

trackingIdInput.addEventListener("input", () => {
    trackingIdInput.value =
        trackingIdInput.value.toUpperCase();
});