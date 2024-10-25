import React from 'react'; // Import React
import {
  ListItem,
  ListItemText,
  Checkbox,
  IconButton,
  Badge,
  Typography,
  Button,
} from '@mui/material'; // Import Material-UI components
import DeleteIcon from '@mui/icons-material/Delete'; // Import Delete icon
import { useTheme } from '@mui/material/styles'; // Import useTheme for theme management

// TaskItem component to display individual task details
const TaskItem = ({ task, toggleComplete, editTask, handleDeleteConfirmation }) => {
  const theme = useTheme(); // Get the current theme
  // Check if the task is overdue
  const isOverdue = new Date(task.dueDate) < new Date() && !task.completed;
  // Determine the status of the task (Completed, Overdue, Pending)
  const status = task.completed ? 'Completed' : isOverdue ? 'Overdue' : 'Pending';

  return (
    <ListItem
      key={task.id} // Unique key for the list item
      dense // Makes the list item more compact
      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} // Flexbox for layout
    >
      <div style={{ flexGrow: 1 }}> {/* Allows the item to grow and take available space */}
        <ListItemText
          primary={
            <Typography 
              variant="h6" 
              style={{ 
                textDecoration: task.completed ? 'line-through' : 'none',
                color: isOverdue ? 'red' : theme.palette.mode === 'dark' ? 'white' : 'inherit', // Set text color for overdue tasks
              }}
            >
              {task.title} 
            </Typography>
          }
          secondary={
            <>
              <Typography 
                variant="body2" 
                style={{ color: theme.palette.mode === 'dark' ? 'white' : 'inherit' }} // Set text color for description
              >
                {task.description}
              </Typography> 
              <Typography 
                variant="body2" 
                style={{ color: theme.palette.mode === 'dark' ? 'white' : 'inherit' }} // Set text color for due date and priority
              >
                Due: {task.dueDate} | Priority: {task.priority}
              </Typography> 
            </>
          }
        />
        {/* Badge to show the status of the task */}
        <Badge
          badgeContent={status} // Status displayed in the badge
          color={task.completed ? 'success' : isOverdue ? 'error' : 'primary'} // Change color based on status
          style={{ marginLeft: '10px' }} // Margin to separate badge from text
        />
      </div>

      {/* Checkbox to mark the task as complete */}
      <Checkbox
        checked={task.completed} // Checkbox checked state based on task completion
        onChange={() => toggleComplete(task.id)} // Handle checkbox change
        disabled={task.completed || isOverdue} // Disable if the task is completed or overdue
      />

      {/* Button to edit the task */}
      <Button
        variant="contained"
        color="secondary" // Color variant for the button
        size="small" // Small size for the button
        onClick={() => editTask(task)} // Handle edit action
        style={{ marginRight: '8px' }} // Margin to the right
      >
        Edit
      </Button>

      {/* Button to delete the task */}
      <IconButton edge="end" color="secondary" onClick={() => handleDeleteConfirmation(task)}>
        <DeleteIcon /> {/* Icon for deletion */}
      </IconButton>
    </ListItem>
  );
};

export default TaskItem; // Export the TaskItem component
