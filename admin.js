import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


const adminIssues =
    document.getElementById("adminIssues");

const adminLoading =
    document.getElementById("adminLoading");

const adminEmpty =
    document.getElementById("adminEmpty");

const refreshReports =
    document.getElementById("refreshReports");


const totalIssues =
    document.getElementById("totalIssues");

const submittedIssues =
    document.getElementById("submittedIssues");

const reviewIssues =
    document.getElementById("reviewIssues");

const progressIssues =
    document.getElementById("progressIssues");

const resolvedIssues =
    document.getElementById("resolvedIssues");


function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value || "";

    return div.innerHTML;

}


function formatDate(timestamp) {

    if (!timestamp) {
        return "Recently submitted";
    }

    const date =
        timestamp.toDate();

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit"
        }
    );

}


function updateStatistics(issues) {

    const counts = {
        total: issues.length,
        submitted: 0,
        review: 0,
        progress: 0,
        resolved: 0
    };


    issues.forEach(issue => {

        switch (issue.status) {

            case "Submitted":

                counts.submitted++;

                break;


            case "Under Review":

                counts.review++;

                break;


            case "In Progress":

                counts.progress++;

                break;


            case "Resolved":

                counts.resolved++;

                break;

        }

    });


    totalIssues.textContent =
        counts.total;

    submittedIssues.textContent =
        counts.submitted;

    reviewIssues.textContent =
        counts.review;

    progressIssues.textContent =
        counts.progress;

    resolvedIssues.textContent =
        counts.resolved;

}


function createIssueCard(issue, documentId) {

    const imageHTML =
        issue.imageUrl

            ? `<img
                class="admin-issue-image"
                src="${issue.imageUrl}"
                alt="Issue evidence"
            >`

            : `<div class="admin-no-image">
                No evidence image
            </div>`;


    return `
        <article
            class="admin-issue-card"
            data-document-id="${documentId}"
        >

            ${imageHTML}


            <div class="admin-issue-content">


                <div class="admin-issue-top">

                    <div>

                        <div class="admin-issue-id">
                            ${escapeHTML(issue.issueId)}
                        </div>

                        <h3 class="admin-issue-title">
                            ${escapeHTML(issue.title)}
                        </h3>

                    </div>


                    <div class="admin-current-status">
                        ${escapeHTML(
                            issue.status || "Submitted"
                        )}
                    </div>

                </div>


                <div class="admin-issue-info">


                    <div class="admin-info-item">

                        <span>Category</span>

                        <p>
                            ${escapeHTML(
                                issue.category
                            )}
                        </p>

                    </div>


                    <div class="admin-info-item">

                        <span>Description</span>

                        <p>
                            ${escapeHTML(
                                issue.description
                            )}
                        </p>

                    </div>


                    <div class="admin-info-item">

                        <span>Location</span>

                        <p>
                            ${escapeHTML(
                                issue.location
                            )}
                        </p>

                    </div>


                    <div class="admin-info-item">

                        <span>Submitted</span>

                        <p>
                            ${formatDate(
                                issue.createdAt
                            )}
                        </p>

                    </div>


                </div>


                <div class="admin-status-control">


                    <select
                        class="admin-status-select"
                    >

                        <option
                            value="Submitted"
                            ${
                                issue.status === "Submitted"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Submitted
                        </option>


                        <option
                            value="Under Review"
                            ${
                                issue.status === "Under Review"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Under Review
                        </option>


                        <option
                            value="In Progress"
                            ${
                                issue.status === "In Progress"
                                    ? "selected"
                                    : ""
                            }
                        >
                            In Progress
                        </option>


                        <option
                            value="Resolved"
                            ${
                                issue.status === "Resolved"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Resolved
                        </option>

                    </select>


                    <button
                        type="button"
                        class="update-status-btn"
                    >
                        Update
                    </button>


                </div>


            </div>

        </article>
    `;

}


async function loadReports() {

    try {

        adminIssues.innerHTML = "";

        adminEmpty.classList.remove("show");

        adminLoading.classList.add("show");


        const querySnapshot =
            await getDocs(
                collection(db, "issues")
            );


        const issues = [];


        querySnapshot.forEach(document => {

            issues.push({

                documentId:
                    document.id,

                ...document.data()

            });

        });


        /*
           Sort newest reports first.
        */

        issues.sort((a, b) => {

            if (
                !a.createdAt ||
                !b.createdAt
            ) {
                return 0;
            }

            return (
                b.createdAt.seconds -
                a.createdAt.seconds
            );

        });


        updateStatistics(issues);


        if (issues.length === 0) {

            adminEmpty.classList.add("show");

            return;

        }


        issues.forEach(issue => {

            adminIssues.innerHTML +=
                createIssueCard(
                    issue,
                    issue.documentId
                );

        });


    } catch (error) {

        console.error(
            "Error loading reports:",
            error
        );

        alert(
            "Unable to load reports. Please check Firestore permissions."
        );

    } finally {

        adminLoading.classList.remove("show");

    }

}


adminIssues.addEventListener(
    "click",

    async event => {

        const updateButton =
            event.target.closest(
                ".update-status-btn"
            );


        if (!updateButton) {
            return;
        }


        const issueCard =
            updateButton.closest(
                ".admin-issue-card"
            );


        const documentId =
            issueCard.dataset.documentId;


        const statusSelect =
            issueCard.querySelector(
                ".admin-status-select"
            );


        const newStatus =
            statusSelect.value;


        const originalText =
            updateButton.textContent;


        try {

            updateButton.disabled = true;

            updateButton.textContent =
                "Updating...";


            await updateDoc(

                doc(
                    db,
                    "issues",
                    documentId
                ),

                {
                    status:
                        newStatus
                }

            );


            /*
               Update visible status immediately
            */

            const statusElement =
                issueCard.querySelector(
                    ".admin-current-status"
                );


            statusElement.textContent =
                newStatus;


            updateButton.textContent =
                "Updated ✓";


            /*
               Refresh statistics
            */

            await loadReports();


        } catch (error) {

            console.error(
                "Status update error:",
                error
            );

            alert(
                "Unable to update the issue status."
            );


            updateButton.textContent =
                originalText;

            updateButton.disabled =
                false;

        }

    }
);


refreshReports.addEventListener(
    "click",

    loadReports
);


loadReports();