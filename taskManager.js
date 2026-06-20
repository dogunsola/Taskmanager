const addTsk = document.querySelector(".add-button");

function updateCounts() {
  const total = document.querySelectorAll(".tasks-container .task-item").length;
  const completed = document.querySelectorAll(
    ".tasks-container .task-item.completed",
  ).length;
  const totalEl = document.getElementById("totalTasks");
  const doneEl = document.getElementById("completedTasks");
  if (totalEl) totalEl.textContent = total;
  if (doneEl) doneEl.textContent = completed;
}

addTsk.addEventListener("click", () => {
  const newTaskValue = document.querySelector(".task-input").value;
  const taskContainer = document.querySelector(".tasks-container");
  if (newTaskValue.trim() === "") return;

  const templateElement = document.getElementById("task-template");
  const clone = templateElement.content.cloneNode(true);
  const uniqueId = "Task" + Date.now();
  const checkbox = clone.querySelector(".checkbox");
  const label = clone.querySelector(".task-name");
  const menuBtn = clone.querySelector(".menu-btn");
  const menuSelect = clone.querySelector(".menu-btn-select");
  const taskItem = clone.querySelector(".task-item");
  const badgesContainer = clone.querySelector(".task-badges");

  checkbox.id = uniqueId;
  label.setAttribute("for", uniqueId);
  label.innerText = newTaskValue;

  // Toggle the menu overlay for this task only
  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    menuSelect.hidden = !menuSelect.hidden;
  });

  // When clicking outside a task, close any open menus (use event delegation)
  document.addEventListener("click", (e) => {
    if (!menuSelect) return;
    if (!menuSelect.contains(e.target) && e.target !== menuBtn) {
      menuSelect.hidden = true;
    }
  });

  // Single-choice handlers for Status and Priority lists
  const statusItems = menuSelect.querySelectorAll("#status-list li");
  const priorityItems = menuSelect.querySelectorAll("#task-priority li");

  statusItems.forEach((li) => {
    // apply badge styling classes to menu options
    const txt = li.textContent.trim();
    if (txt.toLowerCase() === "pending")
      li.classList.add("badge", "status", "pending");
    if (txt.toLowerCase() === "completed")
      li.classList.add("badge", "status", "completed-badge");

    li.addEventListener("click", (e) => {
      e.stopPropagation();
      // ensure only one selected in this list
      statusItems.forEach((s) => s.classList.remove("selected"));
      li.classList.add("selected");

      // update the task's badges: remove previous status badges
      badgesContainer
        .querySelectorAll(".badge.status")
        .forEach((b) => b.remove());
      const badge = document.createElement("span");
      badge.className = Array.from(li.classList).filter(Boolean).join(" ");
      badge.textContent = txt;
      badgesContainer.appendChild(badge);

      // if user selected Completed, mark task completed and check the checkbox
      if (txt.toLowerCase() === "completed") {
        taskItem.classList.add("completed");
        checkbox.checked = true;
      } else if (txt.toLowerCase() === "pending") {
        taskItem.classList.remove("completed");
        checkbox.checked = false;
      }
      updateCounts();
    });
  });

  priorityItems.forEach((li) => {
    const txt = li.textContent.trim();
    // map text to priority classes
    if (txt.toLowerCase() === "high")
      li.classList.add("badge", "priority", "high");
    if (txt.toLowerCase() === "medium")
      li.classList.add("badge", "priority", "medium");
    if (txt.toLowerCase() === "low")
      li.classList.add("badge", "priority", "low");

    li.addEventListener("click", (e) => {
      e.stopPropagation();
      priorityItems.forEach((p) => p.classList.remove("selected"));
      li.classList.add("selected");

      // update the task's badges: remove previous priority badges
      badgesContainer
        .querySelectorAll(".badge.priority")
        .forEach((b) => b.remove());
      const badge = document.createElement("span");
      badge.className = Array.from(li.classList).filter(Boolean).join(" ");
      badge.textContent = txt;
      badgesContainer.appendChild(badge);
    });
  });

  // Checkbox toggles completed state and updates status badge
  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      taskItem.classList.add("completed");
      // update status selection UI
      statusItems.forEach((s) => s.classList.remove("selected"));
      const completedLi = Array.from(statusItems).find(
        (s) => s.textContent.trim().toLowerCase() === "completed",
      );
      if (completedLi) completedLi.classList.add("selected");

      // set badge
      badgesContainer
        .querySelectorAll(".badge.status")
        .forEach((b) => b.remove());
      const b = document.createElement("span");
      b.className = "badge status completed-badge";
      b.textContent = "Completed";
      badgesContainer.appendChild(b);
      updateCounts();
    } else {
      taskItem.classList.remove("completed");
      statusItems.forEach((s) => s.classList.remove("selected"));
      const pendingLi = Array.from(statusItems).find(
        (s) => s.textContent.trim().toLowerCase() === "pending",
      );
      if (pendingLi) pendingLi.classList.add("selected");

      badgesContainer
        .querySelectorAll(".badge.status")
        .forEach((b) => b.remove());
      const b = document.createElement("span");
      b.className = "badge status pending";
      b.textContent = "Pending";
      badgesContainer.appendChild(b);
      updateCounts();
    }
  });

  taskContainer.append(clone);
  updateCounts();
  document.querySelector(".task-input").value = "";
});

// Filter buttons: show All / Completed / Incomplete
const filterButtons = document.querySelectorAll('.filter-btn');
function applyFilter(filter) {
  const tasks = document.querySelectorAll('.tasks-container .task-item');
  tasks.forEach((t) => {
    if (filter === 'all') {
      t.style.display = '';
    } else if (filter === 'completed') {
      t.style.display = t.classList.contains('completed') ? '' : 'none';
    } else if (filter === 'incomplete') {
      t.style.display = !t.classList.contains('completed') ? '' : 'none';
    }
  });
}

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter || 'all';
    applyFilter(filter);
  });
});
