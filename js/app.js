// ========================
// State
// ========================

//Step 1: Data model (in-memory storage)
// Array to hold all tasks
let tasks = [];

// ========================
// DOM Elements
// ========================

const taskList = document.getElementById('tasksList');
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');

// ========================
// Storage
// ========================


const STORAGE_KEY = "daily tasks"; //like database

//Step 4: save and load tasks with local storage
function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); //converts js array -> string
}

function loadTasks() {
    const storedTasks = localStorage.getItem(STORAGE_KEY);
    if(storedTasks) {
        tasks = JSON.parse(storedTasks); //converts string -> js array
    }
}

// ========================
// Task Factory
// ========================

//create a task object
function createTask(text) {
    return {
        id: Date.now(),     //unique number
        text: text,         //task desc
        completed: false    //default state
    };
}


// ========================
// CRUD Operations
// ========================

// add a task in the array
function addTask(text) {
    const task = createTask(text);
    tasks.push(task);
    console.log("Task added: ", task)
    console.log("All tasks: ", tasks)
    saveTasks();
    renderTasks();
}

function toggleTask(taskId) {
    tasks = tasks.map(function (task) {
        if (task.id === taskId) {
            return {
                ...task,
                completed: !task.completed
            };
        }
        return task;
    });
    saveTasks();
    renderTasks();
}

function deleteTask(taskId) {
    tasks = tasks.filter(function (task) {
        return task.id !== taskId;
    });
    saveTasks();
    renderTasks();
}


// ========================
// Rendering
// ========================

//Step 2: Rendering tasks to the page
function renderTasks() {
    //Clear the list
    tasksList.innerHTML = '';

    //Step 5: add checkboxes and visual feedback
    tasks.forEach(function (task) {
        const li = document.createElement("li");
        li.classList.add("task-item");

        const leftGroup = document.createElement("div");
        leftGroup.classList.add("task-left");

        // Chekcbox
        const checkbox = document.createElement("input");
        checkbox.classList.add("task-checkbox");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", function () {
            toggleTask(task.id);
        });

        // Task text
        const span = document.createElement("span");
        span.classList.add("task-text");
        span.textContent = task.text;
        //visual feedback for completed task
        if (task.completed) {
            span.style.textDecoration = "line-through";
        }

        // Step 6: Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("task-delete");
        deleteBtn.textContent = "X";
        deleteBtn.addEventListener("click", function () {
            deleteTask(task.id);
        });

        leftGroup.append(checkbox, span);
        li.append(leftGroup, deleteBtn);
        tasksList.append(li);
    });
}

// ========================
// Event Listeners
// ========================
//Step 3: Input and button elements

addTaskBtn.addEventListener('click', function(){
    const text = taskInput.value;

    if(text.trim() === '') {
        return; //don't add empty tasks
    }

    addTask(text);
    taskInput.value = ''; //clear input field
});

taskInput.addEventListener('keydown', function (event){
    if(event.key === 'Enter'){
        addTaskBtn.click();
    }
});


// ========================
// Initial Load
// ========================

loadTasks();
renderTasks();