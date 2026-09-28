// ==============================
// HTML ELEMENTS
// ==============================

const taskInput = document.getElementById("taskInput");
const dueDateInput = document.getElementById("dueDateInput");
const addButton = document.getElementById("addButton");

const taskList = document.getElementById("taskList");

const welcomeMessage = document.getElementById("welcomeMessage");
const logoutButton = document.getElementById("logoutButton");

const totalTasks = document.getElementById("totalTasks");
const remainingTasks = document.getElementById("remainingTasks");
const completedTasks = document.getElementById("completedTasks");

const filterButtons = document.querySelectorAll(".filter-button");

const emptyState = document.getElementById("emptyState");


// ==============================
// LOGIN CHECK
// ==============================

const loggedInUser = JSON.parse(
    localStorage.getItem("user")
);

if (!loggedInUser) {
    window.location.href = "login.html";
}

// Get the login token
const token = localStorage.getItem("token");

if (!token) {
    localStorage.removeItem("user");
    window.location.href = "login.html";
}

welcomeMessage.textContent =
    "Welcome, " + loggedInUser.name + " 👋";


// ==============================
// LOGOUT
// ==============================

logoutButton.addEventListener("click", function () {

    localStorage.removeItem("user");

    window.location.href = "login.html";

});


// ==============================
// API
// ==============================

const API_URL =
    "http://localhost:3000/api/tasks";


// ==============================
// APP STATE
// ==============================

let allTasks = [];

let currentFilter = "all";


// ==============================
// LOAD TASKS
// ==============================

async function loadTasks() {

    try {

       const response = await fetch(
    API_URL,
    {
        headers: {
            "Authorization": "Bearer " + token
        }
    }
);

        if (!response.ok) {
            throw new Error("Could not load tasks");
        }

        const tasks = await response.json();

        allTasks = tasks;

        updateStatistics();

        applyFilter();

    } catch (error) {

        console.log(
            "Error loading tasks:",
            error
        );

    }

}


// ==============================
// ADD TASK
// ==============================

async function addTask() {

    const taskName =
        taskInput.value.trim();

    const dueDate =
        dueDateInput.value;

    if (taskName === "") {

        taskInput.focus();

        return;

    }

    try {

        addButton.disabled = true;

        addButton.textContent =
            "Adding...";

        const response = await fetch(
            API_URL,
            {

                method: "POST",

               headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + token
},

                body: JSON.stringify({

                    name: taskName,

                   

                    due_date:
                        dueDate || null

                })

            }
        );

        if (!response.ok) {
            throw new Error(
                "Could not add task"
            );
        }

        taskInput.value = "";

        dueDateInput.value = "";

        await loadTasks();

        taskInput.focus();

    } catch (error) {

        console.log(
            "Error adding task:",
            error
        );

    } finally {

        addButton.disabled = false;

        addButton.textContent =
            "Add Task";

    }

}


// ==============================
// COMPLETE / UNCOMPLETE
// ==============================

async function toggleTask(task) {

    try {

        const response = await fetch(
            API_URL + "/" + task.id,
            {

                method: "PUT",

               headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + token
},

                body: JSON.stringify({

                    completed:
                        !Boolean(task.completed)

                })

            }
        );

        if (!response.ok) {
            throw new Error(
                "Could not update task"
            );
        }

        await loadTasks();

    } catch (error) {

        console.log(
            "Error updating task:",
            error
        );

    }

}


// ==============================
// DELETE TASK
// ==============================

async function deleteTask(id) {

    try {

        const response = await fetch(
    API_URL + "/" + id,
    {
        method: "DELETE",

        headers: {
            "Authorization": "Bearer " + token
        }
    }
);
        

        await loadTasks();

    } catch (error) {

        console.log(
            "Error deleting task:",
            error
        );

    }

}


// ==============================
// STATISTICS
// ==============================

function updateStatistics() {

    const total =
        allTasks.length;

    const completed =
        allTasks.filter(function (task) {

            return Boolean(
                task.completed
            );

        }).length;

    const remaining =
        total - completed;

    totalTasks.textContent =
        total;

    remainingTasks.textContent =
        remaining;

    completedTasks.textContent =
        completed;

}


// ==============================
// FILTER TASKS
// ==============================

function applyFilter() {

    let filteredTasks = [];

    if (currentFilter === "active") {

        filteredTasks =
            allTasks.filter(
                function (task) {

                    return !Boolean(
                        task.completed
                    );

                }
            );

    } else if (
        currentFilter === "completed"
    ) {

        filteredTasks =
            allTasks.filter(
                function (task) {

                    return Boolean(
                        task.completed
                    );

                }
            );

    } else {

        filteredTasks = allTasks;

    }

    displayTasks(filteredTasks);

}


// ==============================
// FILTER BUTTONS
// ==============================

filterButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                currentFilter =
                    button.dataset.filter;

                filterButtons.forEach(
                    function (btn) {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );

                button.classList.add(
                    "active"
                );

                applyFilter();

            }
        );

    }
);


// ==============================
// DISPLAY TASKS
// ==============================

function displayTasks(tasks) {

    taskList.innerHTML = "";

    // Empty state

    if (tasks.length === 0) {

        emptyState.classList.add(
            "show"
        );

        return;

    }

    emptyState.classList.remove(
        "show"
    );


    tasks.forEach(
        function (task) {

            const li =
                document.createElement(
                    "li"
                );

            li.classList.add(
                "task"
            );


            // =====================
            // CHECK BUTTON
            // =====================

            const checkButton =
                document.createElement(
                    "button"
                );

            checkButton.classList.add(
                "check-button"
            );

            checkButton.setAttribute(
                "aria-label",
                "Complete task"
            );


            if (Boolean(task.completed)) {

                checkButton.classList.add(
                    "checked"
                );

                checkButton.textContent =
                    "✓";

                li.classList.add(
                    "task-completed"
                );

            }


            checkButton.addEventListener(
                "click",
                function () {

                    toggleTask(task);

                }
            );


            // =====================
            // TASK TEXT
            // =====================

            const taskText =
                document.createElement(
                    "span"
                );

            taskText.textContent =
                task.name;

            taskText.classList.add(
                "task-text"
            );


            if (Boolean(task.completed)) {

                taskText.classList.add(
                    "completed"
                );

            }


            taskText.addEventListener(
                "click",
                function () {

                    toggleTask(task);

                }
            );


            // =====================
            // DUE DATE
            // =====================

            const dueDate =
                document.createElement(
                    "small"
                );

            dueDate.classList.add(
                "due-date"
            );

            setDueDate(
                dueDate,
                task
            );


            // =====================
            // DELETE
            // =====================

            const deleteButton =
                document.createElement(
                    "button"
                );

            deleteButton.textContent =
                "🗑️";

            deleteButton.classList.add(
                "delete-button"
            );

            deleteButton.setAttribute(
                "aria-label",
                "Delete task"
            );


            deleteButton.addEventListener(
                "click",
                function () {

                    deleteTask(
                        task.id
                    );

                }
            );


            // =====================
            // ADD TO CARD
            // =====================

            li.appendChild(
                checkButton
            );

            li.appendChild(
                taskText
            );

            li.appendChild(
                dueDate
            );

            li.appendChild(
                deleteButton
            );


            taskList.appendChild(
                li
            );

        }
    );

}


// ==============================
// SMART DUE DATE
// ==============================

function setDueDate(
    element,
    task
) {

    if (!task.due_date) {

        element.textContent =
            "No due date";

        return;

    }


    // Take only YYYY-MM-DD.
    // This avoids timezone problems
    // with database DATE values.

    const dateString =
        String(task.due_date)
            .slice(0, 10);

    const dateParts =
        dateString
            .split("-")
            .map(Number);


    const taskDate =
        new Date(
            dateParts[0],
            dateParts[1] - 1,
            dateParts[2]
        );


    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );


    const tomorrow =
        new Date(today);

    tomorrow.setDate(
        today.getDate() + 1
    );


    // Completed tasks should not
    // be marked overdue.

    if (
        taskDate < today &&
        !Boolean(task.completed)
    ) {

        element.textContent =
            "⚠️ Overdue";

        element.classList.add(
            "overdue"
        );

    } else if (
        taskDate.getTime() ===
        today.getTime()
    ) {

        element.textContent =
            "📅 Due today";

    } else if (
        taskDate.getTime() ===
        tomorrow.getTime()
    ) {

        element.textContent =
            "📅 Due tomorrow";

    } else {

        element.textContent =
            "📅 " +
            taskDate.toLocaleDateString(
                "en-US",
                {

                    month: "short",

                    day: "numeric",

                    year: "numeric"

                }
            );

    }

}


// ==============================
// ADD BUTTON
// ==============================

addButton.addEventListener(
    "click",
    addTask
);


// ==============================
// ENTER KEY
// ==============================

taskInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            addTask();

        }

    }
);


// ==============================
// START APP
// ==============================

loadTasks();