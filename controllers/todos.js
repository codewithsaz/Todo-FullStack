const Todo = require("../models/todos");

exports.addTodo = (req, res, next) => {
  const title = req.body.title;
  const task = req.body.task;
  const date = req.body.date;
  const completed = req.body.completed;
  Todo.create({
    title: title,
    task: task,
    date: date,
    completed: completed,
  });
  res.send("Todo Added");
};

exports.updateTodo = (req, res, next) => {
  const expId = req.params.id;
  const title = req.body.title;
  const task = req.body.task;
  const date = req.body.date;
  const completed = req.body.completed;
  Todo.findByPk(expId).then((todo) => {
    todo.set({
      title: title,
      task: task,
      date: date,
      completed: completed,
    });

    todo.save();
    res.send("Todo Updated");
  });
};

exports.getTodosRemaining = (req, res, next) => {
  Todo.findAll({
    where: {
      completed: 0,
    },
  }).then((todos) => {
    res.json(todos);
  });
};

exports.getTodosCompleted = (req, res, next) => {
  Todo.findAll({
    where: {
      completed: 1,
    },
  }).then((todos) => {
    res.json(todos);
  });
};

exports.getTodo = (req, res, next) => {
  const expId = req.params.id;
  Todo.findByPk(expId).then((todo) => {
    res.json(todo);
  });
};

exports.deleteTodo = (req, res) => {
  const expId = req.params.id;
  Todo.findByPk(expId).then((todo) => {
    todo.destroy().then(() => res.send("Todo Deleted"));
  });
};
