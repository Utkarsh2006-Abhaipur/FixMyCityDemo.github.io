let issues = JSON.parse(localStorage.getItem("issues")) || [];

// ================================
// PAGE NAVIGATION
// ================================
function showPage(pageId) {
    const pages = document.querySelectorAll(".page");

    pages.forEach(function (page) {
        page.classList.remove("active");
    });

    const targetPage = document.getElementById(pageId);

    if (!targetPage) {
        return;
    }

    targetPage.classList.add("active");

    // Refresh data whenever a page is opened
    displayReports();
    displayAdminIssues();
    updateStatistics();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ================================
// REPORT ISSUE FORM
// ================================
const issueForm = document.getElementById("issueForm");

if (issueForm) {
    issueForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const title = document.getElementById("title").value.trim();
        const category = document.getElementById("category").value;
        const description = document.getElementById("description").value.trim();
        const location = document.getElementById("location").value.trim();

        // Unique Issue ID
        const issueId = "FMC-" + Date.now();

        const newIssue = {
            id: issueId,
            title: title,
            category: category,
            description: description,
            location: location,
            status: "Reported",
            date: new Date().toLocaleDateString()
        };

        // Save issue
        issues.push(newIssue);

        localStorage.setItem(
            "issues",
            JSON.stringify(issues)
        );

        alert(
            "Issue reported successfully!\n\nYour Issue ID is: " +
            issueId
        );

        // Reset form
        issueForm.reset();

        // Update statistics
        updateStatistics();

        // Open My Reports page
        showPage("reports");
    });
}


// ================================
// DISPLAY USER REPORTS
// ================================
function displayReports() {
    const reportsList =
        document.getElementById("reportsList");

    if (!reportsList) {
        return;
    }

    reportsList.innerHTML = "";

    if (issues.length === 0) {
        reportsList.innerHTML =
            "<p class='empty-message'>No issues reported yet.</p>";

        return;
    }

    issues.forEach(function (issue) {

        const statusClass = issue.status
            .toLowerCase()
            .replace(/\s+/g, "-");

        const card = document.createElement("div");

        card.classList.add("issue-card");

        card.innerHTML = `
            <h3>${escapeHTML(issue.title)}</h3>

            <p>
                <strong>Issue ID:</strong>
                ${escapeHTML(issue.id)}
            </p>

            <p>
                <strong>Category:</strong>
                ${escapeHTML(issue.category)}
            </p>

            <p>
                <strong>Description:</strong>
                ${escapeHTML(issue.description)}
            </p>

            <p>
                <strong>Location:</strong>
                ${escapeHTML(issue.location)}
            </p>

            <p>
                <strong>Date:</strong>
                ${escapeHTML(issue.date)}
            </p>

            <span class="status ${statusClass}">
                ${escapeHTML(issue.status)}
            </span>
        `;

        reportsList.appendChild(card);
    });
}


// ================================
// ADMIN DASHBOARD
// ================================
function displayAdminIssues() {
    const adminIssues =
        document.getElementById("adminIssues");

    if (!adminIssues) {
        return;
    }

    adminIssues.innerHTML = "";

    if (issues.length === 0) {
        adminIssues.innerHTML =
            "<p class='empty-message'>No issues available.</p>";

        return;
    }

    issues.forEach(function (issue, index) {

        const statusClass = issue.status
            .toLowerCase()
            .replace(/\s+/g, "-");

        const card = document.createElement("div");

        card.classList.add("issue-card");

        card.innerHTML = `
            <h3>${escapeHTML(issue.title)}</h3>

            <p>
                <strong>ID:</strong>
                ${escapeHTML(issue.id)}
            </p>

            <p>
                <strong>Category:</strong>
                ${escapeHTML(issue.category)}
            </p>

            <p>
                <strong>Description:</strong>
                ${escapeHTML(issue.description)}
            </p>

            <p>
                <strong>Location:</strong>
                ${escapeHTML(issue.location)}
            </p>

            <p>
                <strong>Date:</strong>
                ${escapeHTML(issue.date)}
            </p>

            <span class="status ${statusClass}">
                ${escapeHTML(issue.status)}
            </span>

            <select
                class="status-select"
                onchange="changeStatus(${index}, this.value)"
            >
                <option value="Reported">
                    Reported
                </option>

                <option value="In Progress">
                    In Progress
                </option>

                <option value="Resolved">
                    Resolved
                </option>
            </select>
        `;

        // Set current status
        const select = card.querySelector(".status-select");

        if (select) {
            select.value = issue.status;
        }

        adminIssues.appendChild(card);
    });
}


// ================================
// CHANGE ISSUE STATUS
// ================================
function changeStatus(index, newStatus) {

    if (!issues[index]) {
        return;
    }

    issues[index].status = newStatus;

    // Save updated data
    localStorage.setItem(
        "issues",
        JSON.stringify(issues)
    );

    // Refresh pages and statistics
    displayReports();
    displayAdminIssues();
    updateStatistics();
}


// ================================
// UPDATE HERO STATISTICS
// ================================
function updateStatistics() {

    const total = issues.length;

    let reported = 0;
    let pending = 0;
    let resolved = 0;

    issues.forEach(function (issue) {

        if (issue.status === "Reported") {
            reported++;

        } else if (issue.status === "In Progress") {
            pending++;

        } else if (issue.status === "Resolved") {
            resolved++;
        }
    });

    setText("totalReports", total);
    setText("reportedCount", reported);
    setText("pendingCount", pending);
    setText("resolvedCount", resolved);
}


// ================================
// HELPER: SET TEXT
// ================================
function setText(id, value) {

    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}


// ================================
// SECURITY: ESCAPE HTML
// ================================
function escapeHTML(value) {

    const div = document.createElement("div");

    div.textContent = value ?? "";

    return div.innerHTML;
}


// ================================
// HERO BUTTONS
// ================================
const reportButton =
    document.getElementById("heroReportBtn");

const exploreButton =
    document.getElementById("heroExploreBtn");


if (reportButton) {

    reportButton.addEventListener(
        "click",
        function () {
            showPage("report");
        }
    );
}


if (exploreButton) {

    exploreButton.addEventListener(
        "click",
        function () {
            showPage("reports");
        }
    );
}


// ================================
// INITIAL LOAD
// ================================
displayReports();
displayAdminIssues();
updateStatistics();