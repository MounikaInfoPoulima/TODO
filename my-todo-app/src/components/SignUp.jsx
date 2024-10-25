import React, { useState } from 'react'; // Import React and useState hook
import {
    Container,
    TextField,
    Button,
    Typography,
    Snackbar,
    Alert,
    InputAdornment,
    IconButton,
    Box,
    CircularProgress, // Import CircularProgress for loading indication
} from '@mui/material'; // Import Material-UI components
import { Visibility, VisibilityOff } from '@mui/icons-material'; // Import icons for showing/hiding password
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing

const Signup = () => {
    // State variables for user input and feedback
    const [username, setUsername] = useState(''); 
    const [password, setPassword] = useState(''); 
    const [confirmPassword, setConfirmPassword] = useState(''); 
    const [error, setError] = useState(''); 
    const [success, setSuccess] = useState(false); 
    const [loading, setLoading] = useState(false); 
    const [showPassword, setShowPassword] = useState(false); 
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); 
    const navigate = useNavigate(); 

    // Function to handle signup form submission
    const handleSignup = async (e) => {
        e.preventDefault(); 
        setLoading(true); 

        if (password !== confirmPassword) {
            setError("Passwords do not match."); 
            setLoading(false); 
            return; 
        }

        if (username && password) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            localStorage.setItem('user', JSON.stringify({ username, password }));
            setSuccess(true); 

            setTimeout(() => {
                setSuccess(false); 
                setLoading(false); 
                navigate('/todo'); 
            }, 3000);
        } else {
            setError('Signup failed. Please try again.'); 
            setLoading(false); 
        }
    };

    // Function to close the success snackbar
    const handleCloseSnackbar = () => {
        setSuccess(false); 
    };

    // Function to redirect to the login page
    const handleLoginRedirect = () => {
        navigate('/'); 
    };

    return (
        <Box
            sx={{
                backgroundSize: 'cover', 
                backgroundPosition: 'center', 
                height: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
            }}
        >
            <Container maxWidth="xs" sx={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: 3 }}>
                <Typography variant="h4" gutterBottom textAlign="center">Sign Up</Typography>
                <form onSubmit={handleSignup}>
                    <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} 
                        required
                    />
                    <TextField
                        label="Create Password"
                        type={showPassword ? 'text' : 'password'}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        required
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                        {showPassword ? <VisibilityOff /> : <Visibility />} 
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        label="Confirm Password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        required
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />} 
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button variant="contained" color="primary" type="submit" fullWidth sx={{ marginTop: '16px' }} disabled={loading}>
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
                    </Button>
                </form>
                {error && <p style={{ color: 'red' }}>{error}</p>} 
                <Snackbar open={success} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                    <Alert severity="success" onClose={handleCloseSnackbar}>
                        Signup successful! Redirecting...
                    </Alert>
                </Snackbar>
                <Button variant="text" onClick={handleLoginRedirect} sx={{ marginTop: '16px' }}>
                    Already have an account? Log In
                </Button>
            </Container>
        </Box>
    );
};

export default Signup; // Export the Signup component
