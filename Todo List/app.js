let form = document.querySelector('#main-div');
let taskInput = document.querySelector('#add-task-input');
let filter = document.querySelector('#filter-tasks-input');
let clearBtn = document.querySelector('#clear-tasks');
let ul = document.querySelector('#task-list');

loadEventListeners();

function loadEventListeners() {
    document.addEventListener('DOMContentLoaded', getTasks);
    form.addEventListener('submit', addTask);
    clearBtn.addEventListener('click', clearTasks);
    ul.addEventListener('click', removeTask);
}

function getTasksFromLocalStorage(tasksFromLS) {
    if (tasksFromLS === null) {
        return [];
    }
    return JSON.parse(tasksFromLS)
}

function getTasks() {
    let tasks = getTasksFromLocalStorage(localStorage.getItem('tasks'));
    populateTable(tasks)
}

function populateTable(list) {
    list = list.sort((a, b) => a.priority - b.priority);
    // ul.innerHTML = '';
    // faster
     while (ul.firstChild) {
        ul.removeChild(ul.firstChild)
    }
    list.forEach((x) => {
        insertListItem(x);
    })
}

function insertListItem(task) {
    let li = document.createElement('li');
    li.appendChild(document.createTextNode(task.name))
    li.style.borderBottom = '0.5px solid wheat'
    li.style.padding = '2px'
    li.style.margin = '2px'
    let link = document.createElement('a');
    let icon = document.createElement('i');
    link.className = 'delete-link';
    icon.className = "fa fa-remove";
    icon.style.cssFloat = 'right';
    link.style.cursor = 'pointer';
    link.innerHTML = icon.outerHTML;
    // link.style.marginLeft = '20px';
    link.style.color = 'red';
    li.appendChild(link);
    ul.appendChild(li);
}


function addTask(e) {
    let tasks = getTasksFromLocalStorage(localStorage.getItem('tasks'));
    if (taskInput.value == '') {
        alert('add a task');
        e.target.querySelector('#submit-button').blur();
        e.preventDefault();
        return;
    }
   
    if (tasks.map(task => task.name).includes(taskInput.value)) {
        alert('task already exists');
        taskInput.value = '';
        e.target.querySelector('#submit-button').blur();
        e.preventDefault();
        return;
    }

    let priority = document.getElementById("priority");
    let task = { name: taskInput.value, priority: priority.value };
    tasks.push(task)
    localStorage.setItem('tasks', JSON.stringify(tasks))
    populateTable(tasks)
    taskInput.value = '';
    e.target.querySelector('#submit-button').blur()
    e.preventDefault();
}


function clearTasks(e) {
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild)
    }
    localStorage.clear();
    e.target.blur();
}

function removeTask(e) {
    if (e.target.parentElement.classList.contains('delete-link')) {
        if (confirm('Are you sure?')) {
            e.target.parentElement.parentElement.remove();
            removeTaskFromLocasStorage(e.target.parentElement.parentElement)
        }
    }
}

function removeTaskFromLocasStorage(task) {
    let tasks = getTasksFromLocalStorage(localStorage.getItem('tasks'));
    for (let i = 0; i < tasks.length; i++) {
        if (task.textContent === tasks[i].name) {
            tasks.splice(i, 1);
            break;
        }
    }
    localStorage.setItem('tasks', JSON.stringify(tasks))
}