import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  Grid,
  Snackbar,
  List,
  ListItem,
  Checkbox,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const TaskForm = ({ addTask, editingTask, handleEditTask }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [priority, setPriority] = useState('');
  const [subtasks, setSubtasks] = useState(['']); // To manage subtasks
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (editingTask) {
      setTaskTitle(editingTask.title);
      setDescription(editingTask.description);
      setDueDate(editingTask.dueDate.split(' ')[0]);
      setDueTime(editingTask.dueDate.split(' ')[1]);
      setPriority(editingTask.priority);
      setSubtasks(editingTask.subtasks); // Load existing subtasks
    } else {
      setTaskTitle('');
      setDescription('');
      setDueDate('');
      setDueTime('');
      setPriority('');
      setSubtasks(['']); // Reset subtasks
    }
  }, [editingTask]);

  const handleSubmit = () => {
    if (!taskTitle || !description || !dueDate || !dueTime || !priority) {
      setErrorMessage('Please fill out all fields!');
      setOpenSnackbar(true);
      return;
    }

    const newTask = {
      title: taskTitle,
      description,
      dueDate: `${dueDate} ${dueTime}`,
      priority,
      completed: false,
      id: editingTask ? editingTask.id : Date.now(),
      subtasks: subtasks.map((subtask) => ({ title: subtask, completed: false })), // Map subtasks to the desired structure
    };

    if (editingTask) {
      handleEditTask(newTask);
    } else {
      addTask(newTask);
    }

    setTaskTitle('');
    setDescription('');
    setDueDate('');
    setDueTime('');
    setPriority('');
    setSubtasks(['']); // Reset subtasks
  };

  const handleSubtaskChange = (index, value) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks[index] = value;
    setSubtasks(updatedSubtasks);
  };

  const addSubtask = () => {
    setSubtasks([...subtasks, '']); // Add a new empty subtask
  };

  return (
    <Box
      sx={{
        backgroundColor: '#e0f7fa',
        padding: 3,
        borderRadius: 2,
        boxShadow: 3,
        marginBottom: 2,
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Task Title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="time"
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              label="Priority"
            >
              <MenuItem value="" disabled>Select Priority</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <h3>Subtasks</h3>
          <List>
            {subtasks.map((subtask, index) => (
              <ListItem key={index}>
                <TextField
                  label={`Subtask ${index + 1}`}
                  value={subtask}
                  onChange={(e) => handleSubtaskChange(index, e.target.value)}
                  fullWidth
                />
              </ListItem>
            ))}
          </List>
          <Button variant="outlined" onClick={addSubtask}>
            Add Subtask
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            {editingTask ? 'Edit Task' : 'Add Task'}
          </Button>
        </Grid>
      </Grid>

      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TaskForm;
