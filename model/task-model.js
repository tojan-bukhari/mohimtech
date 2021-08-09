const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taskSchema = new Schema({
  text: {
     type: String,
      required: true 
      },
  date: {
     type: String,
      required: true },
  priority: {
    type: String,
    required: true },
    task_num:{type:Number},
  });

const Task = mongoose.model('task', taskSchema);

module.exports = Task;

