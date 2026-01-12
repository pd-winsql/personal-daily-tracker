// ========================
// State
// ========================

// Data model (in-memory storage)
// Array to hold all tasks
let tasks = [];

// ========================
// DOM Elements
// ========================

const taskList = document.getElementById('tasksList');
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const completionPercentage = document.getElementById('completionPercentage');
const progressRingFill = document.querySelector('.progress-ring-fill');

// ========================
// Storage
// ========================


const STORAGE_KEY = "daily tasks"; //like database

// save and load tasks with local storage
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
    updateProgress();
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
    updateProgress();
}

function deleteTask(taskId) {
    tasks = tasks.filter(function (task) {
        return task.id !== taskId;
    });

    saveTasks();
    renderTasks();
    updateProgress();
}


// ========================
// Rendering
// ========================

// Rendering tasks to the page
function renderTasks() {
    //Clear the list
    tasksList.innerHTML = '';

    //checkboxes and visual feedback
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

        //Delete button
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
// Progress Stats
// ========================

function updateProgress() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    
    let percent = 0;
    if (total > 0) {
        percent = Math.round((completed / total) * 100);
    }

    completionPercentage.textContent = percent + '%';

    const radius = 54; //radius of the circle
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;

    progressRingFill.style.strokeDasharray = circumference;
    progressRingFill.style.strokeDashoffset = offset;
}


// ========================
// Daily Reset at Midnight
// ========================

const time = new Date().toLocaleTimeString('en-PH', { hour12: false });

if (time === "00:00:00") {
    tasks.completed = false;
    
    saveTasks();
    renderTasks();
    updateProgress();
}

// ========================
// Initial Load
// ========================

loadTasks();
renderTasks();
updateProgress();