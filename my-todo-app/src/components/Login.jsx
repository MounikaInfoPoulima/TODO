import React, { useState } from 'react';
import {
    Container,
    TextField,
    Button,
    Typography,
    Snackbar,
    Alert,
    IconButton,
    InputAdornment,
    CircularProgress,
    Box,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const Login = ({ onLogin }) => {
    const theme = useTheme(); // Get the current theme
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate a delay for loading (remove in production)
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.username === username && storedUser.password === password) {
            onLogin(username); // Call the onLogin prop function
            navigate('/todo'); // Redirect to the Todo page on successful login
        } else {
            setError('Login failed. Please try again.');
            setOpenSnackbar(true);
        }

        setLoading(false);
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Container
            maxWidth="xs"
            style={{
                textAlign: 'center',
                marginTop: '50px',
            }}
        >
            <Box
                style={{
                    backgroundColor: 'white', // White background for the inner container
                    padding: '20px', // Add some padding
                    borderRadius: '8px', // Rounded corners
                    boxShadow: theme.palette.mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.1)', // Optional shadow
                }}
            >
                <Typography variant="h4" gutterBottom>Login</Typography>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
                        <CircularProgress />
                    </Box>
                ) : (
                    <form onSubmit={handleLogin}>
                        <TextField
                            label="Username"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            InputLabelProps={{
                                style: { padding: '9px 0' },
                            }}
                        />
                        <TextField
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            InputLabelProps={{
                                style: { padding: '9px 0' },
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton 
                                            onClick={handleClickShowPassword} 
                                            edge="end"
                                            sx={{ color: 'black' }} // Set icon color to black for better visibility
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button variant="contained" color="primary" type="submit" fullWidth disabled={loading}>
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                        </Button>
                    </form>
                )}
                <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
                    <Alert onClose={() => setOpenSnackbar(false)} severity="error">{error}</Alert>
                </Snackbar>
                <p>Don't have an account? <a href="/signup">Sign up here</a></p>
            </Box>
        </Container>
    );
};

export default Login;
