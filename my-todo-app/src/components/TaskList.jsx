import React, { useState, useEffect } from 'react';
import { List, TextField, MenuItem, Select, InputLabel, FormControl, Button } from '@mui/material';
import TaskItem from './TaskItem';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dueDateFilter, setDueDateFilter] = useState('');
  const [recurrenceFilter, setRecurrenceFilter] = useState('');

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(storedTasks);
  }, []);

  const toggleComplete = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const deleteTask = (taskToDelete) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskToDelete.id);
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const generateFutureTasks = (task) => {
    const instances = [];
    const now = new Date();
    let nextInstance = new Date(task.dueDate);

    while (nextInstance <= now) {
      nextInstance = getNextInstance(nextInstance, task.recurrence);
    }

    for (let i = 0; i < 10; i++) { // Generate 10 future instances for display
      instances.push({ ...task, dueDate: nextInstance.toISOString() });
      nextInstance = getNextInstance(nextInstance, task.recurrence);
    }

    return instances;
  };

  const getNextInstance = (date, recurrence) => {
    const newDate = new Date(date);
    switch (recurrence) {
      case 'daily':
        newDate.setDate(newDate.getDate() + 1);
        break;
      case 'weekly':
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 'monthly':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      default:
        break;
    }
    return newDate;
  };

  const filteredTasks = tasks.flatMap(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter ? task.priority === priorityFilter : true;
    const matchesCategory = categoryFilter ? task.category === categoryFilter : true;
    const matchesDueDate = dueDateFilter ? new Date(task.dueDate).toDateString() === new Date(dueDateFilter).toDateString() : true;
    const matchesRecurrence = recurrenceFilter ? task.recurrence === recurrenceFilter : true;

    if (matchesSearch && matchesPriority && matchesCategory && matchesDueDate && matchesRecurrence) {
      return [task, ...generateFutureTasks(task)];
    }
    return [];
  });

  return (
    <div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <TextField
          label="Search Tasks"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FormControl variant="outlined" style={{ minWidth: 120 }}>
          <InputLabel>Priority</InputLabel>
          <Select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            label="Priority"
          >
            <MenuItem value=""><em>All</em></MenuItem>
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="low">Low</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined" style={{ minWidth: 120 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            label="Category"
          >
            <MenuItem value=""><em>All</em></MenuItem>
            <MenuItem value="work">Work</MenuItem>
            <MenuItem value="personal">Personal</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Due Date"
          type="date"
          variant="outlined"
          value={dueDateFilter}
          onChange={(e) => setDueDateFilter(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <FormControl variant="outlined" style={{ minWidth: 120 }}>
          <InputLabel>Recurrence</InputLabel>
          <Select
            value={recurrenceFilter}
            onChange={(e) => setRecurrenceFilter(e.target.value)}
            label="Recurrence"
          >
            <MenuItem value=""><em>All</em></MenuItem>
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" onClick={() => {
          setSearchTerm('');
          setPriorityFilter('');
          setCategoryFilter('');
          setDueDateFilter('');
          setRecurrenceFilter('');
        }}>
          Reset Filters
        </Button>
      </div>

      <List>
        {filteredTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            toggleComplete={toggleComplete}
            deleteTask={deleteTask}
          />
        ))}
      </List>
    </div>
  );
};

export default TaskList;
