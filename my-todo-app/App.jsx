import React, { useState, useEffect } from 'react';
import M from 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';  
function App() {
  const [tasks, setTasks] = useState([]);

  // Load tasks from localStorage when the component mounts
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  // Save tasks to localStorage when tasks change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  const addTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  const toggleComplete = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
  };

  const isTaskOverdue = (dueDate) => {
    const due = new Date(dueDate);
    const now = new Date();
    return due < now; // Task is overdue if the due date is in the past
  };

  return (
    <div className="container">
      <h4 className="center-align">Todo App</h4>

      {/* Task Form */}
      <TaskForm addTask={addTask} />

      {/* Task List */}
      <h5 className="center-align">Tasks</h5>
      <TaskList
        tasks={tasks}
        toggleComplete={toggleComplete}
        deleteTask={deleteTask}
        isTaskOverdue={isTaskOverdue}
      />
    </div>
  );
}

export default App;
