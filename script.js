let input = document.getElementById("input");
let addbtn = document.getElementById("btn");
let list = document.getElementById("list");

let clearBtn = document.getElementById("clearBtn");
let counter = document.getElementById("counter");

let tasks = [];
let taskId = 0;

addbtn.addEventListener("click", function() {
    let text = input.value;
    if(text === "") {
        let error = document.getElementById("error");
        error.innerHTML = "Please enter a task name   &#x24D8;";
        error.style.display = "block";
        input.focus();
        return;
    }
    else{
        error.textContent = "";
        error.style.display = "none";
    }    

        let task = { id: taskId++, t: text, done: false};
        tasks.push(task);
        taskElement(task);
        storeTasks();
        counters();
        input.value = "";
        input.focus();
});


function taskElement(task) {
    let item = document.createElement("div");
    item.className = "task-item";
    item.setAttribute("data-id", task.id)

    let txt = document.createElement("span");
    txt.textContent = task.t;
    if (task.done) {
        txt.classList.add("completed");
    }

    let check = document.createElement("input");
    check.type = "checkbox";
    check.checked = task.done;
    check.addEventListener("click", function() {
        task.done = check.checked;
        if (task.done) {
            txt.classList.add("completed");
        } 
        else {
            txt.classList.remove("completed");
        }
        storeTasks();
        counters();
    });




    let edit = document.createElement("button");
    edit.innerHTML = '<img id="editBtn" src="edit_icon.png">';
    edit.addEventListener("click", function() {
        let inputEdit = document.createElement("input");
        inputEdit.type = "text";
        inputEdit.value = task.t;
        inputEdit.className = "edit-input";
        item.replaceChild(inputEdit, txt); 
        inputEdit.focus();

        inputEdit.addEventListener("blur", saveEdit);
        inputEdit.addEventListener("keypress", function(e) {
            if (e.key === "Enter") saveEdit();
        });

        function saveEdit() {
            let newText = inputEdit.value;
            if(newText !== "") {
                task.t = newText;
                txt.textContent = newText;
                storeTasks();
            }
            item.replaceChild(txt, inputEdit);
        }

    });

    let del = document.createElement("button");
    del.innerHTML = '<img id="delBtn" src="del_icon.png">';
    del.addEventListener("click", function() {
        tasks = tasks.filter(function(t) {
        return t.id !== task.id;
        });        
        item.remove();
        storeTasks();
        counters();
    });

    
    item.appendChild(check);
    item.appendChild(txt);
    item.appendChild(edit);
    item.appendChild(del);

    list.appendChild(item);
}


function storeTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


window.addEventListener("load", function() {
    let saved = localStorage.getItem("tasks");

    if(saved) {
        tasks = JSON.parse(saved);

        tasks.forEach(function(task) {
            taskElement(task);
        });
        taskId = tasks.length;
    }
    counters();
});


clearBtn.addEventListener("click", function() {
    tasks = [];
    list.innerHTML = "";
    localStorage.removeItem("tasks");
    counters();
});


function counters() {
    let total = tasks.length;
    let completed = 0;
    tasks.forEach(function(task) {
        if(task.done) {
            completed++;
        }
    });
    let remaining = total - completed;
    counter.innerHTML = `
    <span>📝 <strong>total: </strong>${total}</span>   
    <span>✅ <strong>completed: </strong>${completed}</span>    
    <span>⌛ <strong>Remaining: </strong>${remaining}</span>
    `;
}