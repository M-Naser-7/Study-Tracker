const API_BASE = window.API_BASE || "http://localhost:5000/api";

const getToken = () => localStorage.getItem("studyTrackerToken");
const setToken = (token) => localStorage.setItem("studyTrackerToken", token);
const clearToken = () => localStorage.removeItem("studyTrackerToken");

const showError = (message) => {
  const existing = document.querySelector(".error-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "error-toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
};

const checkAuth = () => {
  const token = getToken();
  const isDashboard = window.location.pathname.includes("dashboard");
  
  if (isDashboard && !token) {
    window.location.href = "login.html";
    return false;
  }
  return true;
};

const apiRequest = async (path, options = {}) => {
  const headers = options.headers || {};
  const token = getToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || "Request failed");
  }

  return response.json();
};

const handleAuthForms = () => {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(loginForm);
      const payload = Object.fromEntries(formData.entries());

      try {
        const data = await apiRequest("/auth/login", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setToken(data.token);
        window.location.href = "dashboard.html";
      } catch (error) {
        alert(error.message);
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(registerForm);
      const payload = Object.fromEntries(formData.entries());

      try {
        const data = await apiRequest("/auth/register", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setToken(data.token);
        window.location.href = "dashboard.html";
      } catch (error) {
        showError(error.message || "Registration failed");
      }
    });
  }
};

const renderTasks = (tasks) => {
  const taskList = document.getElementById("task-list");
  if (!taskList) return;

  taskList.innerHTML = "";

  tasks.forEach((task) => {
    const item = document.createElement("div");
    item.className = "task-item";

    const content = document.createElement("div");
    content.innerHTML = `
      <strong>${task.subject} - ${task.topic}</strong>
      <div class="task-meta">
        ${task.deadline ? `Due: ${new Date(task.deadline).toLocaleDateString()}` : "No deadline"}
        · Priority: ${task.priority}
      </div>
    `;

    const actions = document.createElement("div");
    const toggleBtn = document.createElement("button");
    toggleBtn.className = "ghost";
    toggleBtn.textContent = task.completed ? "✓ Done" : "Mark Done";
    toggleBtn.addEventListener("click", () => updateTask(task._id, { completed: !task.completed }));

    const editBtn = document.createElement("button");
    editBtn.className = "ghost";
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => openEditModal(task));

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "ghost";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteTask(task._id));

    actions.append(toggleBtn, editBtn, deleteBtn);
    item.append(content, actions);
    taskList.append(item);
  });
};

const loadTasks = async () => {
  try {
    const tasks = await apiRequest("/tasks");
    renderTasks(tasks);
  } catch (error) {
    showError(error.message || "Failed to load tasks");
  }
};

const createTask = async (payload) => {
  try {
    await apiRequest("/tasks", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    loadTasks();
  } catch (error) {
    showError(error.message || "Failed to create task");
  }
};

const updateTask = async (id, payload) => {
  try {
    await apiRequest(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    loadTasks();
  } catch (error) {
    showError(error.message || "Failed to update task");
  }
};

const deleteTask = async (id) => {
  if (!confirm("Delete this task?")) return;
  try {
    await apiRequest(`/tasks/${id}`, { method: "DELETE" });
    loadTasks();
  } catch (error) {
    showError(error.message || "Failed to delete task");
  }
};

const openEditModal = (task) => {
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal-content">
      <h3>Edit Task</h3>
      <form id="edit-task-form">
        <input name="subject" value="${task.subject}" placeholder="Subject" required />
        <input name="topic" value="${task.topic}" placeholder="Topic" required />
        <input name="deadline" type="date" value="${task.deadline ? task.deadline.split('T')[0] : ''}" />
        <select name="priority">
          <option value="low" ${task.priority === 'low' ? 'selected' : ''}>Low</option>
          <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>Medium</option>
          <option value="high" ${task.priority === 'high' ? 'selected' : ''}>High</option>
        </select>
        <div class="modal-actions">
          <button type="submit" class="primary">Save</button>
          <button type="button" class="ghost" onclick="this.closest('.modal').remove()">Cancel</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelector("#edit-task-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());
    await updateTask(task._id, payload);
    modal.remove();
  });
};

const handleDashboard = () => {
  const dashboard = document.querySelector(".dashboard");
  if (!dashboard) return;

  if (!checkAuth()) return;

  const logoutBtn = document.getElementById("logout-btn");
  logoutBtn?.addEventListener("click", () => {
    clearToken();
    window.location.href = "login.html";
  });

  const taskForm = document.getElementById("task-form");
  taskForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(taskForm);
    const payload = Object.fromEntries(formData.entries());
    createTask(payload);
    taskForm.reset();
  });

  const noteForm = document.getElementById("note-form");
  noteForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(noteForm);
    const payload = Object.fromEntries(formData.entries());
    createNote(payload);
    noteForm.reset();
  });

  setupTimer();
  loadTasks();
  loadNotes();
};

const setupTimer = () => {
  const display = document.getElementById("timer-display");
  if (!display) return;

  const startBtn = document.getElementById("timer-start");
  const pauseBtn = document.getElementById("timer-pause");
  const resetBtn = document.getElementById("timer-reset");
  const modeSelect = document.getElementById("timer-mode");
  const subjectInput = document.getElementById("timer-subject");

  const savedState = JSON.parse(localStorage.getItem("timerState") || "{}");
  let totalSeconds = savedState.totalSeconds || Number(modeSelect.value) * 60;
  let remainingSeconds = savedState.remainingSeconds || totalSeconds;
  let startTime = savedState.startTime || null;
  let intervalId = null;

  const saveState = () => {
    localStorage.setItem("timerState", JSON.stringify({ totalSeconds, remainingSeconds, startTime }));
  };

  const render = () => {
    const minutes = String(Math.floor(remainingSeconds / 60)).padStart(2, "0");
    const seconds = String(remainingSeconds % 60).padStart(2, "0");
    display.textContent = `${minutes}:${seconds}`;
    saveState();
  };

  const resetTimer = () => {
    totalSeconds = Number(modeSelect.value) * 60;
    remainingSeconds = totalSeconds;
    startTime = null;
    render();
  };

  const saveSession = async () => {
    const subject = subjectInput.value.trim() || "Study Session";
    const durationMinutes = Math.round((totalSeconds - remainingSeconds) / 60);
    
    if (durationMinutes < 1) return;

    try {
      await apiRequest("/study/sessions", {
        method: "POST",
        body: JSON.stringify({
          subject,
          durationMinutes,
          startedAt: startTime,
        }),
      });
      showError("Session saved!");
    } catch (error) {
      showError("Failed to save session");
    }
  };

  modeSelect.addEventListener("change", resetTimer);

  startBtn.addEventListener("click", () => {
    if (intervalId) return;
    if (!startTime) startTime = new Date().toISOString();
    
    intervalId = setInterval(() => {
      remainingSeconds -= 1;
      render();
      if (remainingSeconds <= 0) {
        clearInterval(intervalId);
        intervalId = null;
        remainingSeconds = 0;
        render();
        saveSession();
        localStorage.removeItem("timerState");
      }
    }, 1000);
  });

  pauseBtn.addEventListener("click", () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  });

  resetBtn.addEventListener("click", () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    resetTimer();
    localStorage.removeItem("timerState");
  });

  render();
};

const setupWatch = () => {
  const hourHand = document.getElementById("watch-hour");
  const minuteHand = document.getElementById("watch-minute");
  const secondHand = document.getElementById("watch-second");

  if (!hourHand || !minuteHand || !secondHand) return;

  const updateHands = () => {
    const now = new Date();
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours() % 12;

    const secondDeg = seconds * 6;
    const minuteDeg = minutes * 6 + seconds * 0.1;
    const hourDeg = hours * 30 + minutes * 0.5;

    secondHand.style.transform = `translate(-50%, -100%) rotate(${secondDeg}deg)`;
    minuteHand.style.transform = `translate(-50%, -100%) rotate(${minuteDeg}deg)`;
    hourHand.style.transform = `translate(-50%, -100%) rotate(${hourDeg}deg)`;
  };

  updateHands();
  setInterval(updateHands, 1000);
};

const renderNotes = (notes) => {
  const notesList = document.getElementById("notes-list");
  if (!notesList) return;

  notesList.innerHTML = "";
  notes.forEach((note) => {
    const item = document.createElement("div");
    item.className = "note-item";

    const content = document.createElement("div");
    content.innerHTML = `
      <strong>${note.subject}</strong>
      <div class="task-meta">${note.content.substring(0, 80)}${note.content.length > 80 ? '...' : ''}</div>
    `;

    const actions = document.createElement("div");
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "ghost";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteNote(note._id));

    actions.append(deleteBtn);
    item.append(content, actions);
    notesList.append(item);
  });
};

const loadNotes = async () => {
  try {
    const notes = await apiRequest("/notes");
    renderNotes(notes);
  } catch (error) {
    showError(error.message || "Failed to load notes");
  }
};

const createNote = async (payload) => {
  try {
    await apiRequest("/notes", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    loadNotes();
  } catch (error) {
    showError(error.message || "Failed to create note");
  }
};

const deleteNote = async (id) => {
  if (!confirm("Delete this note?")) return;
  try {
    await apiRequest(`/notes/${id}`, { method: "DELETE" });
    loadNotes();
  } catch (error) {
    showError(error.message || "Failed to delete note");
  }
};

handleAuthForms();
handleDashboard();
setupWatch();
