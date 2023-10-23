const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    content: String,
    author: String
});

const Task = new mongoose.model(
    "PYD-Task",
    taskSchema
)

const Prio = new mongoose.model(
    "PYD-Priority",
    taskSchema
)

const Work = new mongoose.model(
    "PYD-Work-task",
    taskSchema
);

const items = [Task, Prio, Work];

module.exports = items;