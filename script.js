document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.querySelector(".search-btn");
  const clearBtn = document.querySelector(".clear-btn");
  const input = document.getElementById("searchInput");
  const taskInput = document.getElementById("taskInput");
  const taskTime = document.getElementById("taskTime");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskList = document.getElementById("taskList");
  const taskInputGroup = document.getElementById("taskInputGrp");
  const plusIcon = document.getElementById("plusIcon");

  let tasks = []; // Array to store tasks

  clearBtn.style.display = "none";

  // Search Input Toggle
  input.addEventListener("input", () => {
    if (input.value.trim().length > 0) {
      searchBtn.style.display = "none";
      clearBtn.style.display = "flex";
    } else {
      searchBtn.style.display = "flex";
      clearBtn.style.display = "none";
    }
  });
  searchBtn.addEventListener("click", () => {
    input.classList.toggle("show");
    if (input.classList.contains("show")) input.focus();
  });
  clearBtn.addEventListener("click", () => {
    input.value = "";
    clearBtn.style.display = "none";
    searchBtn.style.display = "flex";
    input.focus();
  });

  // Notification permission
  if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
  }

  // Toggle Task Input Form
  plusIcon.addEventListener("click", () => {
    taskInputGroup.classList.toggle("hidden");
  });

  function renderTasks() {
    taskList.innerHTML = ""; // Clear current list
    // Sort tasks by time ascending
    tasks.sort((a, b) => new Date(a.time) - new Date(b.time));
    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      li.innerHTML = `
        <span>${task.text} <small class="text-muted">(${task.time})</small></span>
        <button class="remove-btn btn btn-sm btn-danger">&times;</button>
      `;
      // Remove task
      li.querySelector(".remove-btn").addEventListener("click", () => {
        tasks.splice(index, 1); // Remove from array
        renderTasks(); // Re-render
      });
      taskList.appendChild(li);
    });
  }

  function addTask() {
    const taskText = taskInput.value.trim();
    const taskDateTime = taskTime.value;
    if (taskText === "" || taskDateTime === "") return;

    tasks.push({ text: taskText, time: taskDateTime }); // Add to array
    renderTasks();

    // Reminder
    const reminderTime = new Date(taskDateTime).getTime();
    const now = Date.now();
    const timeout = reminderTime - now;
    if (timeout > 0) {
      setTimeout(() => {
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Task Reminder", {
            body: taskText,
            icon: "https://cdn-icons-png.flaticon.com/512/847/847969.png"
          });
        } else {
          alert("Reminder: " + taskText);
        }
      }, timeout);
    }

    // Reset input & hide form
    taskInput.value = "";
    taskTime.value = "";
    taskInputGroup.classList.add("hidden");
  }

  addTaskBtn.addEventListener("click", addTask);
  taskInput.addEventListener("keypress", (e) => { if (e.key === "Enter") addTask(); });
});
