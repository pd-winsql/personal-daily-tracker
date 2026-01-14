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
const streakCount = document.getElementById('streakCount');
const taskDaySelect = document.getElementById('taskDaySelect');
const clearAllBtn = document.getElementById('clearAllBtn');

let currentStreak = Number(localStorage.getItem("currentStreak")) || 0;
let lastCompletedDate = localStorage.getItem("lastCompletedDate");

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
        text: text,    
        day: taskDaySelect.value,    //task desc
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
    updateStreak();
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

    const today = getTodayDay();
    //checkboxes and visual feedback
    tasks
        .filter(task => task.day === today)
        .forEach(function (task) {
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

function renderStreak() {
    streakCount.textContent = currentStreak;
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

clearAllBtn.addEventListener('click', function(){
    tasks = [];
    saveTasks();
    renderTasks();
    updateProgress();
});



// ========================
// Progress Stats
// ========================

function updateProgress() {
    const tasksToday = todayTasks();
    const total = tasksToday.length;
    const completed = tasksToday.filter(task => task.completed).length;

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
// Date Helper section
// ========================



function getTodayDate() {
    return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
}

function resetTasksForNewDay() {
    const today = getTodayDate();
    const lastActiveDate = localStorage.getItem('lastActiveDate');

    if (lastActiveDate && lastActiveDate !== today) {
        if (lastCompletedDate !== lastActiveDate) {
            currentStreak = 0;
            localStorage.setItem("currentStreak", currentStreak)
        }
        tasks = tasks.map(task => ({
            ...task,
            completed: false
        }));
        localStorage.setItem("lastActiveDate", today);
        saveTasks();
    }

    if (!lastActiveDate) {
        localStorage.setItem("lastActiveDate", today);
    }
}

function areAllTasksCompleted() {
    const tasksToday = todayTasks();
    return tasksToday.length > 0 && tasksToday.every(task => task.completed);
}

function updateStreak() {
    const today = getTodayDate();

    if (areAllTasksCompleted() && lastCompletedDate !== today) {
        currentStreak += 1;
        lastCompletedDate = today;

        localStorage.setItem("currentStreak", currentStreak);
        localStorage.setItem("lastCompletedDate", today);
    }
}

function getTodayDay() {
    const days = [
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];
    return days[new Date().getDay()];
}
    
function todayTasks() {
    const today = getTodayDay();
    return tasks.filter(task => task.day === today);
}


// ========================
// Initial Load
// ========================

loadTasks();
resetTasksForNewDay();
updateStreak();
renderStreak();
renderTasks();
updateProgress();