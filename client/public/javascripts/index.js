var $$addTask = document.getElementById('add-task');
var $$taskContainer = document.getElementById('tasks-container');


fetch('/api/tasks').then(function(response){
	if(response.ok) {
		return response.json();
	} 
}).then(function(tasks){
	renderTasks(tasks);
});

bindEventListeners();

function bindEventListeners(){

	$$addTask.addEventListener('click', function(){
		renderTask();
	});

	document.addEventListener('click', function(event){
		var $taskContainer = event.target.parentNode;
		if (event.target.className === 'save-task'){
			var id = $taskContainer.id;
			if (id){
				editTask($taskContainer);
			} else {
				addTask($taskContainer);
			}
		} else if (event.target.className === 'delete-task'){
			deleteTask($taskContainer)
		}
	});
}

//Render function

function renderTasks(tasks){
	for (var i = 0; i < tasks.length; i++){
		renderTask(tasks[i]);
	}
}

function renderTask(task = {}){
	var $taskContainer = document.createElement('div');
	$taskContainer.className = 'task-container';

	if (task.id){
		$taskContainer.id = task.id

		var $taskId = document.createElement('span');
		$taskId.className = 'task-id'
		$taskId.innerText = task.id;
		$taskContainer.appendChild($taskId);
	}

	var $taskName = document.createElement('input');
	$taskName.value = task.name || '';
	$taskName.className = 'task-name'
	$taskContainer.appendChild($taskName);

	var $saveTaskButton = document.createElement('button');
	$saveTaskButton.innerText = 'Save';
	$saveTaskButton.className = 'save-task'
	$taskContainer.appendChild($saveTaskButton);

	var $deleteTaskButton = document.createElement('button');
	$deleteTaskButton.innerText = 'Delete';
	$deleteTaskButton.className = 'delete-task'
	$taskContainer.appendChild($deleteTaskButton);

	$$taskContainer.appendChild($taskContainer);
}



//Handlers

function addTask(taskContainer){
	sendCreateTaskReq(taskContainer).then(function(response){
		if (!response.ok) {
      return response.json().then(Promise.reject.bind(Promise));
    }
    return response.json();
	}).then(function(task){
		renderTask(task)
		taskContainer.remove();
	}).catch(function(response) {
    alert(response.error.message);
  });
}

function editTask(taskContainer){
	sendEditTaskReq(taskContainer).then(function(response){
		if (!response.ok) {
      return response.json().then(Promise.reject.bind(Promise));
    }
    return response.json();
	}).catch(function(response) {
    alert(response.error.message);
  });
}

function deleteTask(taskContainer){
	var id = taskContainer.id;
	sendDeleteTaskReq(id).then(function(response){
		if(response.ok) {
			return;
		} 
	}).then(function(){
		taskContainer.remove();
	});
}

// Requests

function sendEditTaskReq(taskContainer){
	var name = taskContainer.querySelector('.task-name').value;

	return fetch('/api/tasks/' + taskContainer.id, {
		method: 'PUT',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			name: name
		})
	})
}

function sendDeleteTaskReq(id){
	return fetch('/api/tasks/' + id, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		}
	})
}

function sendCreateTaskReq(taskContainer){
	var name = taskContainer.querySelector('.task-name').value;

	return fetch('/api/tasks/', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			name: name
		})
	})
}