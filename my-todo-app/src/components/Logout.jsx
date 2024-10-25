import React, { useState } from 'react'; // Import React and useState
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing
import { Button, CircularProgress } from '@mui/material'; // Import Button and CircularProgress from Material-UI
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon for icons
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; // Import the logout icon

const Logout = ({ onLogout }) => {
    const navigate = useNavigate(); // Initialize the navigate function for routing
    const [loading, setLoading] = useState(false); // State to manage loading status

    // Function to handle the logout process
    const handleLogout = async () => {
        setLoading(true); // Set loading to true when starting the logout process

        // Clear user data from localStorage
        localStorage.removeItem('user'); 
        onLogout(); // Call the provided logout handler function

        // Short delay for visual feedback
        await new Promise((resolve) => setTimeout(resolve, 300)); 

        navigate('/login'); // Redirect to the login page
    };

    return (
        <Button 
            onClick={handleLogout} 
            variant="contained" 
            color="primary" 
            disabled={loading} 
            style={styles.logoutButton}
        >
            {loading ? (
                <CircularProgress size={24} style={styles.loader} /> // Show loader if loading
            ) : (
                <>
                    <FontAwesomeIcon icon={faSignOutAlt} style={styles.icon} /> {/* Render the logout icon */}
                    Logout {/* Button text */}
                </>
            )}
        </Button>
    );
};

// Styles for the logout button and icon
const styles = {
    logoutButton: {
        marginTop: '20px', // Margin at the top
        display: 'flex', // Flexbox to align items
        alignItems: 'center', // Center items vertically
    },
    icon: {
        marginRight: '5px', // Space between icon and text
    },
    loader: {
        marginRight: '5px', // Space between loader and text
    },
};

export default Logout; // Export the Logout component
