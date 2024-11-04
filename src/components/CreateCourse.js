import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify'; // For notifications
import 'react-toastify/dist/ReactToastify.css'; // Include the CSS
import { jwtDecode } from 'jwt-decode'; // Named import

// Import Material UI components
import { Container, Grid, TextField, Button, Typography, IconButton, Box } from '@mui/material';

const CreateCourse = () => {
    const [course, setCourse] = useState({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        price: '',
        modules: [{ title: '', content: '', order: 1 }],
    });
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [userId, setUserId] = useState(null); // State for userId

    useEffect(() => {
        const token = localStorage.getItem('token'); // Assuming you're storing the token in localStorage
        if (token) {
            try {
                const decodedToken = jwtDecode(token); // Use the named import
                setUserId(decodedToken.id); // Set userId from the decoded token
            } catch (error) {
                console.error('Failed to decode token:', error);
                toast.error('Invalid token. Please log in again.');
            }
        }
    }, []);

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        if (!userId) {
            toast.error('User ID not found. Please log in again.');
            return;
        }

        setLoading(true);
        setErrorMessage('');

        try {
            await axios.post('http://localhost:5148/api/Courses', {
                title: course.title,
                description: course.description,
                professorId: userId, // Use the userId obtained from the token
                startDate: course.startDate,
                endDate: course.endDate,
                price: course.price,
                modules: course.modules,
            });
            toast.success('Course created successfully!');
            setCourse({
                title: '',
                description: '',
                startDate: '',
                endDate: '',
                price: '',
                modules: [{ title: '', content: '', order: 1 }],
            }); // Reset course form after submission
        } catch (error) {
            setErrorMessage('Failed to create course. Please try again.');
            console.error('Error creating course:', error);
            toast.error('Failed to create course.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddModule = () => {
        setCourse({
            ...course,
            modules: [...course.modules, { title: '', content: '', order: course.modules.length + 1 }],
        });
    };

    const handleModuleChange = (index, field, value) => {
        const updatedModules = [...course.modules];
        updatedModules[index][field] = value;
        setCourse({ ...course, modules: updatedModules });
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Create a Course
                </Typography>
                <form onSubmit={handleCreateCourse}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Course Title"
                                value={course.title}
                                onChange={(e) => setCourse({ ...course, title: e.target.value })}
                                required
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Course Description"
                                value={course.description}
                                onChange={(e) => setCourse({ ...course, description: e.target.value })}
                                required
                                multiline
                                rows={4}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Start Date"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={course.startDate}
                                onChange={(e) => setCourse({ ...course, startDate: e.target.value })}
                                required
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="End Date"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={course.endDate}
                                onChange={(e) => setCourse({ ...course, endDate: e.target.value })}
                                required
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Price"
                                type="number"
                                value={course.price}
                                onChange={(e) => setCourse({ ...course, price: e.target.value })}
                                required
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Modules
                            </Typography>
                            {course.modules.map((module, index) => (
                                <Box key={index} sx={{ mb: 2 }}>
                                    <TextField
                                        label={`Module ${index + 1} Title`}
                                        value={module.title}
                                        onChange={(e) => handleModuleChange(index, 'title', e.target.value)}
                                        required
                                        fullWidth
                                        sx={{ mb: 1 }}
                                    />
                                    <TextField
                                        label={`Module ${index + 1} Content`}
                                        value={module.content}
                                        onChange={(e) => handleModuleChange(index, 'content', e.target.value)}
                                        required
                                        fullWidth
                                        multiline
                                        rows={3}
                                    />
                                </Box>
                            ))}
                        </Grid>
                        <Grid item xs={12}>
                            <IconButton onClick={handleAddModule} color="primary" aria-label="add module">
                                <FaPlus /> Add Module
                            </IconButton>
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="primary" fullWidth>
                                {loading ? 'Creating...' : 'Create Course'}
                            </Button>
                        </Grid>
                        {errorMessage && (
                            <Grid item xs={12}>
                                <Typography color="error">{errorMessage}</Typography>
                            </Grid>
                        )}
                    </Grid>
                </form>
                <ToastContainer />
            </Box>
        </Container>
    );
};

export default CreateCourse;
