// Selecting DOM elements
//we're selecting various DOM elements using the document.querySelector and document.querySelectorAll methods. These elements include the input field for tasks, the filter buttons, the "Clear All" button, and the container for displaying tasks. 
const taskInput = document.querySelector(".task-input input"),
      filters = document.querySelectorAll(".filters span"),
      clearAll = document.querySelector(".clear-btn"),
      taskBox = document.querySelector(".task-box");


// editId is used to track the ID of the task being edited, isEditTask is a boolean flag to determine if we are editing a task, and todos holds an array of tasks loaded from local storage
let editId,
    isEditTask = false,
    todos = JSON.parse(localStorage.getItem("todo-list"));

// Callbacks, When a filter button is clicked, it toggles the active class among the filter buttons, then calls the showTodo function with the selected filter.
filters.forEach(btn => {
    btn.addEventListener("click", () => {
        
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        
        showTodo(btn.id);
    });
});

//  showTodo function displays tasks based on the selected filter. It iterates through the todos array and constructs HTML for each task based on its status. The HTML is added to liTag, which is then inserted into the taskBox container. The function also handles the "Clear All" button's visibility and adjusts the overflow behavior of the task container.
function showTodo(filter) {
    let liTag = "";
    if(todos) {
        todos.forEach((todo, id) => {
            let completed = todo.status == "completed" ? "checked" : "";
            if(filter == todo.status || filter == "all") {
                liTag += `
  <li class="task">
    <label for="${id}">
      <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
      <p class="${completed}">${todo.name}</p>
    </label>
    <div class="settings">
      <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
      <ul class="task-menu">
        <li onclick='editTask(${id}, "${todo.name}")'>
          <i class="uil uil-pen"></i>Edit
        </li>
        <li onclick='deleteTask(${id}, "${filter}")'>
          <i class="uil uil-trash"></i>Delete
        </li>
      </ul>
    </div>
  </li>`;
            }
        });
    }
    taskBox.innerHTML = liTag || `<span>You don't have any task here</span>`;
    let checkTask = taskBox.querySelectorAll(".task");
    !checkTask.length ? clearAll.classList.remove("active") : clearAll.classList.add("active");
    taskBox.offsetHeight >= 300 ? taskBox.classList.add("overflow") : taskBox.classList.remove("overflow");
}
showTodo("all");

// This creates a closure, The showMenu function displays the settings menu when the ellipsis icon is clicked. It adds the "show" class to the menu container and also listens for clicks outside the menu to close it.
function showMenu(selectedTask) {
    let menuDiv = selectedTask.parentElement.lastElementChild;
    menuDiv.classList.add("show");
    document.addEventListener("click", e => {
        if(e.target.tagName != "I" || e.target != selectedTask) {
            menuDiv.classList.remove("show");
        }
    });
}

// Update task status when checkbox is clicked (Event Handling)
function updateStatus(selectedTask) {
    let taskName = selectedTask.parentElement.lastElementChild;
    if (selectedTask.checked) {
        taskName.classList.add("checked");
        todos[selectedTask.id].status = "completed";
    } else {
        taskName.classList.remove("checked");
        todos[selectedTask.id].status = "pending";
    }
    localStorage.setItem("todo-list", JSON.stringify(todos));
}


// Edit a task when edit icon is clicked (Event Handling)
function editTask(taskId, textName) {
    editId = taskId;
    isEditTask = true;
    taskInput.value = textName;
    taskInput.focus();
    taskInput.classList.add("active");
}

// Delete a task when delete icon is clicked (Event Handling)
function deleteTask(deleteId, filter) {
    isEditTask = false;
    todos.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo(filter);
}

// Clear all tasks when Clear All button is clicked (Event Handling)
clearAll.addEventListener("click", () => {
    isEditTask = false;
    todos.splice(0, todos.length);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo()
});

// Add or edit task when Enter key is pressed (Event Handling)
taskInput.addEventListener("keyup", e => {
    let userTask = taskInput.value.trim();
    if(e.key == "Enter" && userTask) {
        if(!isEditTask) {
            todos = !todos ? [] : todos;
            let taskInfo = {name: userTask, status: "pending"};
            todos.push(taskInfo);
        } else {
            isEditTask = false;
            todos[editId].name = userTask;
        }
        taskInput.value = "";
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodo(document.querySelector("span.active").id);
    }
});


