const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Base de datos en memoria
let tasks = [];

// Rutas de la API
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

app.post('/tasks', (req, res) => {
    const newTask = {
        id: Date.now(),
        todo: req.body.todo,
        completed: false,
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

app.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    tasks = tasks.filter(task => task.id !== taskId);
    res.status(204).send();
});

app.patch('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const task = tasks.find(task => task.id === taskId);
    if (task) {
        task.completed = !task.completed;
        res.json(task);
    } else {
        res.status(404).send();
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
