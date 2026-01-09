//Step 1: Data model (in-memory storage)
// Array to hold all tasks
let tasks = [];

//create a task object
function createTask(text) {
    return {
        id: Date.now(),     //unique number
        text: text,         //task desc
        completed: false    //default state
    };
}

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

//Step 2: Rendering tasks to the page
const taskList = document.getElementById('tasksList');

function renderTasks() {
    //Clear the list
    tasksList.innerHTML = '';

    //Step 5: add checkboxes and visual feedback
    tasks.forEach(function (task) {
        const li = document.createElement('li');

        // Chekcbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", function () {
            toggleTask(task.id);
        });

        // Task text
        const span = document.createElement("span");
        span.textContent = task.text;

        //visual feedback for completed task
        if (task.completed) {
            li.style.textDecoration = "line-through";
        }

        li.append(checkbox);
        li.append(span);
        tasksList.append(li);
    });
}

//Step 3: Input and button elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');

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


//Step 4: save and load tasks with local storage

const STORAGE_KEY = "daily tasks"; //like database

function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); //converts js array -> string
}

function loadTasks() {
    const storedTasks = localStorage.getItem(STORAGE_KEY);

    if(storedTasks) {
        tasks = JSON.parse(storedTasks); //converts string -> js array
    }
}

loadTasks();
renderTasks();