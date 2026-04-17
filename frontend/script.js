const API = "https://todo-backend-f205.onrender.com";


function loadTasks() {
    fetch(`${API}/task`)
    .then(res => res.json())
    .then(data => {

        let list = document.getElementById("list");
        list.innerHTML = "";

        
        let completed = data.filter(t => t.Completed).length;
        let total = data.length;

        document.getElementById("countCircle").innerText =
            `${completed}/${total}`;

        let percent = total === 0 ? 0 : (completed / total) * 100;
        document.getElementById("progress").style.width = percent + "%";

        data.forEach(t => {
            let div = document.createElement("div");
            div.className = "task";

            div.innerHTML = `
                <div class="task-left">
                    <input type="checkbox"
                        ${t.Completed ? "checked" : ""}
                        onclick="completeTask(${t.id})">

                    <input type="text"
                        value="${t.title}"
                        id="input-${t.id}"
                        class="${t.Completed ? 'done' : ''}"
                        disabled
                        onkeypress="handleEnter(event, ${t.id})">
                </div>

                <div class="task-actions">
                    <button class="edit-btn" onclick="enableEdit(${t.id})">✏️</button>
                    <button class="delete-btn" onclick="deleteTask(${t.id})">🗑️</button>
                </div>
            `;

            list.appendChild(div);
        });
    });
}


function addTask() {
    let val = document.getElementById("taskInput").value;

    if (!val.trim()) {
        alert("Task cannot be empty");
        return;
    }

    fetch(`${API}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(val)   
    })
    .then(() => {
        document.getElementById("taskInput").value = "";
        loadTasks();
    });
}

function completeTask(id) {
    fetch(`${API}/tasks/${id}/complete`, {
        method: "PUT"
    })
    .then(() => loadTasks());
}


function deleteTask(id) {
    fetch(`${API}/tasks/${id}`, {
        method: "DELETE"
    })
    .then(() => loadTasks());
}


function enableEdit(id) {
    let input = document.getElementById(`input-${id}`);
    input.disabled = false;
    input.focus();
}


function handleEnter(event, id) {
    if (event.key === "Enter") {
        let input = document.getElementById(`input-${id}`);
        let newTitle = input.value;

        if (!newTitle.trim()) {
            alert("Title cannot be empty");
            return;
        }

        fetch(`${API}/tasks/${id}/title`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: newTitle })  
        })
        .then(() => {
            input.disabled = true;
            loadTasks();
        });
    }
}


loadTasks();