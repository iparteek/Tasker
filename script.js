  document.addEventListener('DOMContentLoaded', () => {
    const addBtn = document.getElementById('add');
    const taskInput = document.querySelector('#new-task input');
    const tasksContainer = document.getElementById('tasks');
  
    // Load tasks from Chrome storage on startup
    chrome.storage.sync.get(['tasks'], (result) => {
      const tasks = result.tasks || [];
      tasks.forEach(task => {
        addTaskToDOM(task.text, task.completed);
      });
    });
  
    addBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        addTask();
      }
    });
  
    function addTask() {
      const taskText = taskInput.value.trim();
      if (taskText.length === 0) {
        alert('Please enter a Task');
      } else {
        const task = { text: taskText, completed: false };
        chrome.storage.sync.get(['tasks'], (result) => {
          const tasks = result.tasks || [];
          tasks.push(task);
          chrome.storage.sync.set({ tasks }, () => {
            addTaskToDOM(task.text, task.completed);
          });
        });
        taskInput.value = '';
      }
    }
  
    function addTaskToDOM(taskText, completed) {
      const taskDiv = document.createElement('div');
      taskDiv.classList.add('task');
  
      const taskLabel = document.createElement('label');
      taskLabel.classList.add('taskCheck');
  
      const taskCheckbox = document.createElement('input');
      taskCheckbox.type = 'checkbox';
      taskCheckbox.classList.add('taskCheckbox');
      taskCheckbox.checked = completed;
      taskCheckbox.addEventListener('change', () => {
        updateTaskStatus(taskText, taskCheckbox.checked);
      });
  
      const taskSpan = document.createElement('span');
      taskSpan.classList.add('task-name');
      taskSpan.textContent = taskText;
      if (completed) {
        taskSpan.style.textDecoration = 'line-through';
      }
  
      const deleteBtn = document.createElement('button');
      deleteBtn.classList.add('delete');
      deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
      deleteBtn.addEventListener('click', () => {
        deleteTask(taskText);
        taskDiv.remove();
      });
  
      taskLabel.appendChild(taskCheckbox);
      taskLabel.appendChild(taskSpan);
      taskDiv.appendChild(taskLabel);
      taskDiv.appendChild(deleteBtn);
      tasksContainer.appendChild(taskDiv);
    }
  
    function updateTaskStatus(taskText, completed) {
      chrome.storage.sync.get(['tasks'], (result) => {
        const tasks = result.tasks || [];
        const updatedTasks = tasks.map(task => {
          if (task.text === taskText) {
            return { text: task.text, completed };
          }
          return task;
        });
        chrome.storage.sync.set({ tasks: updatedTasks });
      });
    }
  
    function deleteTask(taskText) {
      chrome.storage.sync.get(['tasks'], (result) => {
        const tasks = result.tasks || [];
        const updatedTasks = tasks.filter(task => task.text !== taskText);
        chrome.storage.sync.set({ tasks: updatedTasks });
      });
    }
  });
  
  