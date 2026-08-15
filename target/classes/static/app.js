let tickets = [];

let editingTicketId = null;


/*
 * Load tickets from Spring Boot
 */

async function loadTickets() {

    try {

        const response =
            await fetch("/api/tickets");

        if (!response.ok) {

            throw new Error(
                "Unable to load tickets"
            );

        }

        tickets =
            await response.json();

        updateDashboard();

        populateCategories();

        renderTickets();

        loadEnvironment();

    } catch (error) {

        console.error(error);

        alert(
            "Unable to connect to the IT service API."
        );
    }
}


/*
 * Load deployment environment
 */

async function loadEnvironment() {

    try {

        const response =
            await fetch(
                "/api/migration-info"
            );

        if (!response.ok) {

            return;
        }

        const data =
            await response.json();

        document.getElementById(
            "environmentBadge"
        ).textContent =
            data.environment
                .toUpperCase();

    } catch (error) {

        console.error(error);
    }
}


/*
 * Dashboard statistics
 */

function updateDashboard() {

    document.getElementById(
        "totalTickets"
    ).textContent =
        tickets.length;


    document.getElementById(
        "openTickets"
    ).textContent =
        tickets.filter(
            ticket =>
                ticket.status === "OPEN"
        ).length;


    document.getElementById(
        "progressTickets"
    ).textContent =
        tickets.filter(
            ticket =>
                ticket.status === "IN_PROGRESS"
        ).length;


    document.getElementById(
        "resolvedTickets"
    ).textContent =
        tickets.filter(
            ticket =>
                ticket.status === "RESOLVED"
        ).length;
}


/*
 * Populate category filter
 */

function populateCategories() {

    const select =
        document.getElementById(
            "categoryFilter"
        );


    const categories =
        [...new Set(
            tickets.map(
                ticket => ticket.category
            )
        )];


    select.innerHTML =
        `<option value="ALL">
            All Categories
         </option>`;


    categories.forEach(category => {

        const option =
            document.createElement("option");

        option.value = category;

        option.textContent = category;

        select.appendChild(option);

    });
}


/*
 * Render tickets
 */

function renderTickets() {

    const tbody =
        document.getElementById(
            "ticketTableBody"
        );


    const search =
        document.getElementById(
            "searchInput"
        ).value.toLowerCase();


    const status =
        document.getElementById(
            "statusFilter"
        ).value;


    const category =
        document.getElementById(
            "categoryFilter"
        ).value;


    const filtered =
        tickets.filter(ticket => {

            const matchesSearch =

                ticket.title
                    .toLowerCase()
                    .includes(search)

                ||

                ticket.description
                    .toLowerCase()
                    .includes(search);


            const matchesStatus =

                status === "ALL"

                ||

                ticket.status === status;


            const matchesCategory =

                category === "ALL"

                ||

                ticket.category === category;


            return (
                matchesSearch &&
                matchesStatus &&
                matchesCategory
            );

        });


    tbody.innerHTML = "";


    filtered.forEach(ticket => {

        const row =
            document.createElement("tr");


        const statusClass =
            getStatusClass(
                ticket.status
            );


        row.innerHTML = `

            <td>
                ${ticket.id}
            </td>

            <td>
                <strong>
                    ${escapeHtml(ticket.title)}
                </strong>

                <br>

                <small>
                    ${escapeHtml(ticket.description)}
                </small>
            </td>

            <td>
                ${escapeHtml(ticket.category)}
            </td>

            <td>
                <span class="status ${statusClass}">
                    ${formatStatus(ticket.status)}
                </span>
            </td>

            <td>
                ${formatDate(ticket.createdAt)}
            </td>

            <td>

                <button
                    class="action-button"
                    onclick="editTicket(${ticket.id})">

                    Edit

                </button>

                <button
                    class="action-button delete-button"
                    onclick="deleteTicket(${ticket.id})">

                    Delete

                </button>

            </td>

        `;


        tbody.appendChild(row);

    });
}


/*
 * Search/filter
 */

function filterTickets() {

    renderTickets();

}


/*
 * Status formatting
 */

function formatStatus(status) {

    return status
        .replace("_", " ")
        .replace(
            /\w\S*/g,
            word =>
                word.charAt(0)
                    .toUpperCase()
                +
                word.substring(1)
                    .toLowerCase()
        );
}


/*
 * Status CSS class
 */

function getStatusClass(status) {

    if (status === "OPEN") {

        return "status-open";

    }


    if (status === "IN_PROGRESS") {

        return "status-progress";

    }


    return "status-resolved";
}


/*
 * Create modal
 */

function openCreateModal() {

    editingTicketId = null;

    document.getElementById(
        "modalTitle"
    ).textContent =
        "Create Ticket";


    document.getElementById(
        "ticketForm"
    ).reset();


    document.getElementById(
        "status"
    ).value = "OPEN";


    document.getElementById(
        "ticketModal"
    ).style.display =
        "flex";
}


/*
 * Close modal
 */

function closeModal() {

    document.getElementById(
        "ticketModal"
    ).style.display =
        "none";

}


/*
 * Edit ticket
 */

function editTicket(id) {

    const ticket =
        tickets.find(
            ticket =>
                ticket.id === id
        );


    if (!ticket) {

        return;
    }


    editingTicketId = id;


    document.getElementById(
        "modalTitle"
    ).textContent =
        "Edit Ticket";


    document.getElementById(
        "ticketId"
    ).value =
        ticket.id;


    document.getElementById(
        "title"
    ).value =
        ticket.title;


    document.getElementById(
        "description"
    ).value =
        ticket.description;


    document.getElementById(
        "category"
    ).value =
        ticket.category;


    document.getElementById(
        "status"
    ).value =
        ticket.status;


    document.getElementById(
        "ticketModal"
    ).style.display =
        "flex";
}


/*
 * Save ticket
 */

async function saveTicket(event) {

    event.preventDefault();


    const ticket = {

        title:
            document.getElementById(
                "title"
            ).value,

        description:
            document.getElementById(
                "description"
            ).value,

        category:
            document.getElementById(
                "category"
            ).value,

        status:
            document.getElementById(
                "status"
            ).value

    };


    try {

        let response;


        if (editingTicketId) {

            response =
                await fetch(
                    `/api/tickets/${editingTicketId}`,
                    {

                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(ticket)

                    }
                );

        } else {

            response =
                await fetch(
                    "/api/tickets",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(ticket)

                    }
                );
        }


        if (!response.ok) {

            throw new Error(
                "Failed to save ticket"
            );
        }


        closeModal();

        await loadTickets();


    } catch (error) {

        console.error(error);

        alert(
            "Unable to save ticket."
        );
    }
}


/*
 * Delete ticket
 */

async function deleteTicket(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this ticket?"
        );


    if (!confirmed) {

        return;
    }


    try {

        const response =
            await fetch(
                `/api/tickets/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Delete failed"
            );
        }


        await loadTickets();


    } catch (error) {

        console.error(error);

        alert(
            "Unable to delete ticket."
        );
    }
}


/*
 * Date formatting
 */

function formatDate(date) {

    return new Date(date)
        .toLocaleDateString(
            "en-US",
            {
                year: "numeric",
                month: "short",
                day: "numeric"
            }
        );
}


/*
 * Basic HTML escaping
 */

function escapeHtml(value) {

    const div =
        document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}


/*
 * Start application
 */

document.addEventListener(
    "DOMContentLoaded",
    loadTickets
);