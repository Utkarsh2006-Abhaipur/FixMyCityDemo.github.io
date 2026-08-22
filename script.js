// Get issues from browser storage

let issues = JSON.parse(localStorage.getItem("issues")) || [];


// Function to change pages

function showPage(pageId) {

    // Select all pages

    let pages = document.querySelectorAll(".page");


    // Remove active class from every page

    pages.forEach(function(page) {

        page.classList.remove("active");

    });


    // Show selected page

    document.getElementById(pageId).classList.add("active");


    // Update issue lists

    displayReports();

    displayAdminIssues();

    updateStatistics();

}



// Handle issue form submission

document.getElementById("issueForm").addEventListener("submit", function(event) {

    // Prevent page refresh

    event.preventDefault();


    // Get form values

    let title = document.getElementById("title").value;

    let category = document.getElementById("category").value;

    let description = document.getElementById("description").value;

    let location = document.getElementById("location").value;


    // Create a unique issue ID

    let issueId = "FMC-" + Date.now();


    // Create issue object

    let newIssue = {

        id: issueId,

        title: title,

        category: category,

        description: description,

        location: location,

        status: "Reported",

        date: new Date().toLocaleDateString()

    };


    // Add issue to array

    issues.push(newIssue);


    // Save issues in localStorage

    localStorage.setItem("issues", JSON.stringify(issues));


    // Show success message

    alert("Issue reported successfully! Your Issue ID is: " + issueId);


    // Clear form

    document.getElementById("issueForm").reset();


    // Update statistics

    updateStatistics();


    // Go to My Reports page

    showPage("reports");

});



// Display citizen reports

function displayReports() {

    let reportsList = document.getElementById("reportsList");


    // Clear previous content

    reportsList.innerHTML = "";


    // If no issues exist

    if (issues.length === 0) {

        reportsList.innerHTML = "<p>No issues reported yet.</p>";

        return;

    }


    // Loop through all issues

    issues.forEach(function(issue) {

        let statusClass = issue.status
            .toLowerCase()
            .replace(" ", "-");


        let card = document.createElement("div");

        card.classList.add("issue-card");


        card.innerHTML = `

            <h3>${issue.title}</h3>

            <p><strong>Issue ID:</strong> ${issue.id}</p>

            <p><strong>Category:</strong> ${issue.category}</p>

            <p><strong>Location:</strong> ${issue.location}</p>

            <p><strong>Date:</strong> ${issue.date}</p>

            <span class="status ${statusClass}">
                ${issue.status}
            </span>

        `;


        reportsList.appendChild(card);

    });

}



// Display issues in Admin Dashboard

function displayAdminIssues() {

    let adminIssues = document.getElementById("adminIssues");


    // Clear old content

    adminIssues.innerHTML = "";


    if (issues.length === 0) {

        adminIssues.innerHTML = "<p>No issues available.</p>";

        return;

    }


    issues.forEach(function(issue, index) {

        let statusClass = issue.status
            .toLowerCase()
            .replace(" ", "-");


        let card = document.createElement("div");

        card.classList.add("issue-card");


        card.innerHTML = `

            <h3>${issue.title}</h3>

            <p><strong>ID:</strong> ${issue.id}</p>

            <p><strong>Category:</strong> ${issue.category}</p>

            <p><strong>Description:</strong> ${issue.description}</p>

            <p><strong>Location:</strong> ${issue.location}</p>


            <span class="status ${statusClass}">
                ${issue.status}
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


        // Set current status as selected

        card.querySelector("select").value = issue.status;


        adminIssues.appendChild(card);

    });

}



// Change issue status

function changeStatus(index, newStatus) {

    // Update status

    issues[index].status = newStatus;


    // Save updated issues

    localStorage.setItem("issues", JSON.stringify(issues));


    // Refresh pages

    displayReports();

    displayAdminIssues();

    updateStatistics();

}



// Update home page statistics

function updateStatistics() {

    let total = issues.length;

    let reported = 0;

    let progress = 0;

    let resolved = 0;


    // Count issues by status

    issues.forEach(function(issue) {

        if (issue.status === "Reported") {

            reported++;

        }

        else if (issue.status === "In Progress") {

            progress++;

        }

        else if (issue.status === "Resolved") {

            resolved++;

        }

    });


    // Display statistics

    document.getElementById("totalIssues").textContent = total;

    document.getElementById("reportedIssues").textContent = reported;

    document.getElementById("progressIssues").textContent = progress;

    document.getElementById("resolvedIssues").textContent = resolved;

}



// Run when website starts

displayReports();

displayAdminIssues();

updateStatistics();
