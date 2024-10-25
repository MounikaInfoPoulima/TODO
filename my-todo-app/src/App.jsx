import React, { useState, useEffect } from 'react';
import { Container, Typography, Snackbar, Dialog, DialogActions, DialogContent, DialogTitle, Button, Switch } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import TaskForm from './components/TaskForm';
import TaskItem from './components/TaskItem';
import { List } from '@mui/material';
import Signup from './components/SignUp';
import Login from './components/Login';
import Logout from './components/Logout';

const Alert = React.forwardRef((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

function App() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('user'));
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
    
    // Check for dark mode preference
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setDarkMode(storedTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
    setOpenSnackbar(true);
    setSnackbarMessage('Task added successfully!');
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
    setOpenDialog(false);
    setOpenSnackbar(true);
    setSnackbarMessage('Task deleted successfully!');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('user');
  };

  const handleLogin = (username) => {
    localStorage.setItem('user', username);
    setIsLoggedIn(true);
  };

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem('theme', newMode ? 'dark' : 'light'); // Save the new theme to localStorage
      return newMode;
    });
  };

  const isTaskOverdue = (dueDate) => {
    const currentDate = new Date();
    return new Date(dueDate) < currentDate;
  };

  return (
    <Router>
      <Container maxWidth="md" style={{ textAlign: 'center', backgroundColor: darkMode ? '#121212' : '#ffffff', color: darkMode ? '#ffffff' : '#000000', minHeight: '100vh' }}>
        <Typography variant="h4" gutterBottom>
          Todo App
        </Typography>

        <Switch checked={darkMode} onChange={toggleDarkMode} />
        <Typography variant="body1">
          {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </Typography>

        <Snackbar 
          open={openSnackbar} 
          autoHideDuration={3000} 
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert 
            onClose={() => setOpenSnackbar(false)} 
            severity={snackbarMessage.includes('deleted') ? "error" : "success"}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>

        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/taskform" element={<TaskForm addTask={addTask} editingTask={editingTask} handleEditTask={setEditingTask} />} />
          <Route path="/todo" element={isLoggedIn ? (
            <>
              <TaskForm 
                addTask={addTask} 
                editingTask={editingTask} 
                handleEditTask={setEditingTask} 
              />
              <Typography variant="h5" gutterBottom>Tasks</Typography>
              <List>
                {tasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    toggleComplete={toggleComplete}
                    deleteTask={() => {
                      setTaskToDelete(task);
                      setOpenDialog(true);
                    }}
                    editTask={setEditingTask}
                    isTaskOverdue={isTaskOverdue}
                  />
                ))}
              </List>
              <Logout onLogout={handleLogout} />
              <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                  Are you sure you want to delete this task?
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenDialog(false)} color="primary">Cancel</Button>
                  <Button
                    onClick={() => {
                      if (taskToDelete) {
                        deleteTask(taskToDelete.id);
                      }
                    }}
                    color="secondary"
                  >
                    Delete
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          ) : (
            <Navigate to="/" />
          )} />
          <Route path="/login" element={<Navigate to="/" />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
