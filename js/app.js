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