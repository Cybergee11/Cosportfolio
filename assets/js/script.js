/* ============================================
   COS 106 Term Project — script.js
   Handles: nav toggle, dynamic greeting, project
   rendering, academic planner, contact validation
   ============================================ */

// ----- Footer year (runs on every page) -----
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// ----- Mobile nav toggle -----
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
if (navToggle && navLinks) {
  navToggle.addEventListener("click", function () {
    navLinks.classList.toggle("open");
  });
}

// ----- Dynamic greeting on homepage (time-based content update) -----
const greetingEl = document.getElementById("greeting");
if (greetingEl) {
  const hour = new Date().getHours();
  let greeting = "Welcome!";
  if (hour < 12) {
    greeting = "Good Morning! 👋";
  } else if (hour < 17) {
    greeting = "Good Afternoon! 👋";
  } else {
    greeting = "Good Evening! 👋";
  }
  greetingEl.textContent = greeting;
}

// ----- Animate skill bars on About page -----
const skillBars = document.querySelectorAll(".skill-bar-fill");
if (skillBars.length > 0) {
  window.addEventListener("DOMContentLoaded", function () {
    skillBars.forEach(function (bar) {
      const level = bar.getAttribute("data-level");
      setTimeout(function () {
        bar.style.width = level + "%";
      }, 200);
    });
  });
}

/* ============================================
   PROJECTS PAGE — rendered from an array
   ============================================ */
const projectsGrid = document.getElementById("projects-grid");

if (projectsGrid) {
  // Array of project objects (demonstrates arrays + functions + DOM manipulation)
  const projects = [
    {
      title: "Personal Budget Tracker",
      description:
        "A simple JavaScript app that helps students track income, expenses, and remaining balance for the month.",
      image: "assets/images/project1.svg",
      link: "https://docs.google.com/spreadsheets/d/1xavdFIZe9j8P9tgH-tQxOqnggUR8kxTYMOZXW5UElwQ/edit?usp=sharing",
    },
    {
      title: "Campus Event Finder",
      description:
        "A responsive webpage concept that lists upcoming campus events with filters by category and date.",
      image: "assets/images/project2.svg",
      link: "#",
    },
    {
      title: "Quiz Practice App",
      description:
        "An interactive quiz interface built with HTML, CSS and JavaScript to help students self-test before exams.",
      image: "assets/images/project3.svg",
      link: "#",
    },
  ];

  function renderProjects(list) {
    projectsGrid.innerHTML = ""; // clear first
    list.forEach(function (project) {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML =
        '<img src="' + project.image + '" alt="' + project.title + ' screenshot" />' +
        '<div class="card-body">' +
        "<h3>" + project.title + "</h3>" +
        "<p>" + project.description + "</p>" +
        '<a href="' + project.link + '" class="card-link">View Project &rarr;</a>' +
        "</div>";
      projectsGrid.appendChild(card);
    });
  }

  renderProjects(projects);
}

/* ============================================
   ACADEMIC PLANNER — add / complete / delete
   Uses an array of task objects + localStorage
   ============================================ */
const taskForm = document.getElementById("taskForm");

if (taskForm) {
  const taskInput = document.getElementById("taskInput");
  const taskDateInput = document.getElementById("taskDate");
  const taskList = document.getElementById("task-list");
  const taskCount = document.getElementById("taskCount");
  const taskCompleted = document.getElementById("taskCompleted");
  const emptyMsg = document.getElementById("emptyMsg");

  // Load tasks from localStorage, or start with an empty array
  let tasks = JSON.parse(localStorage.getItem("cos106_tasks")) || [];

  function saveTasks() {
    localStorage.setItem("cos106_tasks", JSON.stringify(tasks));
  }

  function updateStats() {
    const completedCount = tasks.filter(function (t) {
      return t.completed;
    }).length;
    taskCount.textContent = tasks.length + (tasks.length === 1 ? " task" : " tasks");
    taskCompleted.textContent = completedCount + " completed";
    emptyMsg.style.display = tasks.length === 0 ? "block" : "none";
  }

  function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach(function (task, index) {
      const li = document.createElement("li");
      if (task.completed) li.classList.add("completed");

      const left = document.createElement("div");
      left.className = "task-left";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;
      checkbox.addEventListener("change", function () {
        toggleComplete(index);
      });

      const span = document.createElement("span");
      span.className = "task-text";
      span.textContent = task.text;

      left.appendChild(checkbox);
      left.appendChild(span);

      if (task.date) {
        const dateSpan = document.createElement("span");
        dateSpan.className = "task-date";
        dateSpan.textContent = "Due: " + task.date;
        left.appendChild(dateSpan);
      }

      const actions = document.createElement("div");
      actions.className = "task-actions";

      const deleteBtn = document.createElement("button");
      deleteBtn.innerHTML = "🗑️";
      deleteBtn.title = "Delete task";
      deleteBtn.addEventListener("click", function () {
        deleteTask(index);
      });

      actions.appendChild(deleteBtn);

      li.appendChild(left);
      li.appendChild(actions);
      taskList.appendChild(li);
    });

    updateStats();
  }

  function addTask(text, date) {
    tasks.push({ text: text, date: date, completed: false });
    saveTasks();
    renderTasks();
  }

  function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
  }

  function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }

  taskForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const text = taskInput.value.trim();
    const date = taskDateInput.value;

    if (text === "") {
      taskInput.focus();
      return;
    }

    addTask(text, date);
    taskInput.value = "";
    taskDateInput.value = "";
    taskInput.focus();
  });

  renderTasks();
}

/* ============================================
   CONTACT FORM — JavaScript validation
   ============================================ */
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const messageInput = document.getElementById("message");
  const formSuccess = document.getElementById("formSuccess");

  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const phoneError = document.getElementById("phoneError");
  const messageError = document.getElementById("messageError");

  function isValidEmail(value) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(value);
  }

  function isDigitsOnly(value) {
    const pattern = /^[0-9]+$/;
    return pattern.test(value);
  }

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    let isValid = true;
    formSuccess.classList.remove("show");

    // Clear previous errors
    nameError.textContent = "";
    emailError.textContent = "";
    phoneError.textContent = "";
    messageError.textContent = "";

    // Name check
    if (nameInput.value.trim() === "") {
      nameError.textContent = "Name is required.";
      isValid = false;
    }

    // Email check
    if (emailInput.value.trim() === "") {
      emailError.textContent = "Email is required.";
      isValid = false;
    } else if (!isValidEmail(emailInput.value.trim())) {
      emailError.textContent = "Please enter a valid email address.";
      isValid = false;
    }

    // Phone check
    if (phoneInput.value.trim() === "") {
      phoneError.textContent = "Phone number is required.";
      isValid = false;
    } else if (!isDigitsOnly(phoneInput.value.trim())) {
      phoneError.textContent = "Phone number must contain digits only.";
      isValid = false;
    }

    // Message check
    if (messageInput.value.trim() === "") {
      messageError.textContent = "Message cannot be empty.";
      isValid = false;
    }

    if (isValid) {
      formSuccess.classList.add("show");
      contactForm.reset();
    }
  });
}
