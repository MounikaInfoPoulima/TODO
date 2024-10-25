import React, { useState, useEffect } from 'react'; // Import React and hooks
import { List, TextField, MenuItem, Select, InputLabel, FormControl, Button } from '@mui/material'; // Import Material-UI components
import TaskItem from './TaskItem'; // Import TaskItem component

const TaskList = () => {
  const [tasks, setTasks] = useState([]); // State to hold the list of tasks
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [priorityFilter, setPriorityFilter] = useState(''); // State for priority filter
  const [categoryFilter, setCategoryFilter] = useState(''); // State for category filter
  const [dueDateFilter, setDueDateFilter] = useState(''); // State for due date filter

  useEffect(() => {
    // Load tasks from local storage when the component mounts
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || []; // Get tasks from local storage or initialize with an empty array
    setTasks(storedTasks); // Set the tasks state
  }, []); // Empty dependency array ensures this runs only once on mount

  const toggleComplete = (id) => {
    // Function to toggle the completion status of a task
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task // Toggle completion for the task with the matching id
    );
    setTasks(updatedTasks); // Update state with the modified tasks
    localStorage.setItem('tasks', JSON.stringify(updatedTasks)); // Update local storage with the new tasks
  };

  const deleteTask = (taskToDelete) => {
    // Function to delete a task
    const updatedTasks = tasks.filter((task) => task.id !== taskToDelete.id); // Filter out the task to delete
    setTasks(updatedTasks); // Update state with the remaining tasks
    localStorage.setItem('tasks', JSON.stringify(updatedTasks)); // Update local storage
  };

  const editTask = (taskToEdit) => {
    // Logic to edit the task (this needs to be implemented)
  };

  const isTaskOverdue = (dueDate) => {
    // Function to check if a task is overdue
    const currentDate = new Date(); // Get the current date
    return new Date(dueDate) < currentDate; // Compare due date with current date
  };

  // Filter tasks based on search term, priority, category, and due date
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter ? task.priority === priorityFilter : true;
    const matchesCategory = categoryFilter ? task.category === categoryFilter : true;
    const matchesDueDate = dueDateFilter ? new Date(task.dueDate).toDateString() === new Date(dueDateFilter).toDateString() : true;

    return matchesSearch && matchesPriority && matchesCategory && matchesDueDate;
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
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
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
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
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
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Button variant="contained" color="primary" onClick={() => {
          setSearchTerm('');
          setPriorityFilter('');
          setCategoryFilter('');
          setDueDateFilter('');
        }}>
          Reset Filters
        </Button>
      </div>

      <List>
        {/* Map over the filtered tasks array and render a TaskItem for each task */}
        {filteredTasks.map((task) => (
          <TaskItem
            key={task.id} // Unique key for each task
            task={task} // Pass the task object
            toggleComplete={toggleComplete} // Pass the function to toggle completion
            deleteTask={deleteTask} // Pass the function to delete a task
            editTask={editTask} // Pass the function to edit a task
            isTaskOverdue={isTaskOverdue} // Pass the function to check if the task is overdue
          />
        ))}
      </List>
    </div>
  );
};

export default TaskList; // Export the TaskList component
