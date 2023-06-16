var form = document.getElementById("addForm");
var todoRemainingList = document.getElementById("todoRemainingList");
var todoCompletedList = document.getElementById("todoCompletedList");

form.addEventListener("submit", storeTodo);
var updProdBtn = document.getElementById("updateBtn");

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const remaining = await axios.get("http://localhost:4000/todos-remaining");
    const completed = await axios.get("http://localhost:4000/todos-completed");

    for (var i = 0; i < remaining.data.length; i++) {
      console.log(remaining.data[i]);
      addTodoRemaining(remaining.data[i].id, remaining.data[i]);
    }

    for (var i = 0; i < completed.data.length; i++) {
      addTodoCompleted(completed.data[i].id, completed.data[i]);
    }
  } catch {
    (err) => window.alert("Local Database Error \n" + err);
  }
});

async function storeTodo(e) {
  e.preventDefault();

  var todoObj = {
    title: document.getElementById("title").value,
    task: document.getElementById("task").value,
    date: document.getElementById("date").value,
    completed: 0,
  };

  try {
    const res = await axios.post("http://localhost:4000/add-todo", todoObj);
    console.log(res);
    addTodoRemaining("", todoObj);
  } catch {
    (err) => window.alert("Not able to add product \n" + err);
  }
}

async function updateStoreTodo(todoID) {
  var todoObj = {
    title: document.getElementById("title").value,
    task: document.getElementById("task").value,
    date: document.getElementById("date").value,
    completed: 0,
  };

  document.getElementById("updateBtn").style.visibility = "hidden";
  document.getElementById("submitBtn").style.display = "initial";

  try {
    const res = axios.put(
      "http://localhost:4000/update-todo/" + todoID,
      todoObj
    );
    console.log(res);
    addTodoRemaining(todoID, todoObj);
  } catch {
    (err) => window.alert("not able to update product " + err);
  }
}

function addTodoRemaining(todoID, receiveObj) {
  if (document.getElementById("noTodoRem")) {
    todoRemainingList.removeChild(document.getElementById("noTodoRem"));
  }

  var newLi = document.createElement("li");
  var newCard = document.createElement("div");

  var newCardBody = document.createElement("div");
  var newCardTitle = document.createElement("h5");
  var newCardTask = document.createElement("h6");
  var newCardDate = document.createElement("h5");
  var newCardBtnDel = document.createElement("button");
  var newCardBtnUpd = document.createElement("button");
  var newCardBtnCmplt = document.createElement("button");

  newCardBtnDel.className = "btn btn-danger float-end ml-3";
  newCardBtnDel.id = "delete";
  newCardBtnDel.addEventListener("click", (event) => removeTodo(event, todoID));
  newCardBtnDel.appendChild(document.createTextNode("Delete"));

  newCardBtnUpd.className = "btn btn-info float-end ml-3";
  newCardBtnUpd.id = "update";
  newCardBtnUpd.addEventListener("click", (event) => updateTodo(event, todoID));
  newCardBtnUpd.appendChild(document.createTextNode("Update"));

  newCardBtnCmplt.className = "btn btn-info float-end ml-3";
  newCardBtnCmplt.id = "complete";
  newCardBtnCmplt.addEventListener("click", (event) =>
    updateTodoCompleted(event, todoID)
  );
  newCardBtnCmplt.appendChild(document.createTextNode("✓"));

  newCardDate.className = "card-subtitle mx-2 mb-2 text-body-secondary";
  newCardDate.appendChild(document.createTextNode(receiveObj.task));

  newCardTitle.className = "card-title";
  newCardTitle.appendChild(document.createTextNode(receiveObj.title));

  newCardTask.className = "card-title";
  newCardTask.appendChild(document.createTextNode(receiveObj.date));
  newCardBody.className = "card-body ";
  newCardBody.append(
    newCardTitle,
    newCardTask,
    newCardDate,
    newCardBtnCmplt,
    newCardBtnDel,
    newCardBtnUpd
  );

  newCard.className = "todoRem card";
  newCard.id = "todoRemCard";
  newCard.style.width = "18rem";
  newCard.append(newCardBody);

  newLi.className = "list-unstyled col-auto mx-2 my-2";
  newLi.id = todoID;
  newLi.appendChild(newCard);

  document.getElementById("todoRemainingList").appendChild(newLi);

  form.reset();
  if (todoID === "") window.location.reload();
}

function addTodoCompleted(todoID, receiveObj) {
  if (document.getElementById("noTodoComp")) {
    todoCompletedList.removeChild(document.getElementById("noTodoComp"));
  }

  var newLi = document.createElement("li");
  var newCard = document.createElement("div");

  var newCardBody = document.createElement("div");
  var newCardTitle = document.createElement("h5");
  var newCardTask = document.createElement("h6");
  var newCardDate = document.createElement("h5");

  newCardDate.className = "card-subtitle mx-2 mb-2 text-body-secondary";
  newCardDate.appendChild(document.createTextNode(receiveObj.task));

  newCardTitle.className = "card-title";
  newCardTitle.appendChild(document.createTextNode(receiveObj.title));

  newCardTask.className = "card-title";
  newCardTask.appendChild(document.createTextNode(receiveObj.date));

  newCardBody.className = "card-body";
  newCardBody.append(newCardTitle, newCardTask, newCardDate);

  newCard.className = "todoCmplt card";
  newCard.id = "todoCmpltCard";
  newCard.style.width = "18rem";
  newCard.append(newCardBody);

  newLi.className = "list-unstyled col-auto mx-2 my-2";
  newLi.id = todoID;
  newLi.appendChild(newCard);

  document.getElementById("todoCompletedList").appendChild(newLi);
}

async function removeTodo(e, todoID) {
  if (confirm("Want to delete " + todoID + " ?")) {
    var li = $(e.target).parents().eq(2)[0];
    todoRemainingList.removeChild(li);

    console.log("Deleted " + li.id);
    try {
      const res = await axios.delete(
        "http://localhost:4000/delete-todo/" + todoID
      );
      console.log(res);
    } catch {
      (err) => window.alert("Not able to delete product \n" + err);
    }
  }
}

async function updateTodo(e, todoID) {
  document.getElementById("submitBtn").style.display = "none";
  document.getElementById("updateBtn").style.visibility = "visible";

  var li = $(e.target).parents().eq(2)[0];
  todoRemainingList.removeChild(li);
  console.log("Editing  " + li.id);

  try {
    const response = await axios.get("http://localhost:4000/todo/" + todoID);
    editObj = response.data;
    console.log(editObj);
    document.getElementById("title").value = editObj.title;
    document.getElementById("task").value = editObj.task;
    document.getElementById("date").value = editObj.date;

    updProdBtn.addEventListener("click", () => updateStoreTodo(todoID));
  } catch {
    (err) => window.alert("Not able to get product \n" + err);
  }
}

async function updateTodoCompleted(e, todoID) {
  var li = $(e.target).parents().eq(2)[0];
  todoRemainingList.removeChild(li);
  console.log("Editing  " + li.id);

  try {
    const response = await axios.get("http://localhost:4000/todo/" + todoID);
    editObj = response.data;
    console.log(editObj);

    var todoObj = {
      title: editObj.title,
      task: editObj.task,
      date: editObj.date,
      completed: 1,
    };

    try {
      const res = axios.put(
        "http://localhost:4000/update-todo/" + todoID,
        todoObj
      );
      console.log(res);
      addTodoCompleted(todoID, todoObj);
    } catch {
      (err) => window.alert("not able to update product " + err);
    }
  } catch {
    (err) => window.alert("Not able to get product \n" + err);
  }
}
