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

    renderTasks();
}

addTask("Learn JavaScript");
addTask("Build a to-do app");

//Step 2: Rendering tasks to the page

const taskList = document.getElementById('tasksList');

function renderTasks() {
    //Clear the list
    tasksList.innerHTML = '';

    tasks.forEach(function (task) {
        const li = document.createElement('li');
        li.textContent = task.text;
        tasksList.append(li);
    });
}
