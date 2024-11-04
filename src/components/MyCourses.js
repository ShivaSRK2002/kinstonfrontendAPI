import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Typography, List, ListItem, ListItemText, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const MyCourses = () => {
    const [myCourses, setMyCourses] = useState([]);
    const [currentCourseModules, setCurrentCourseModules] = useState([]);
    const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
    const [currentCourseId, setCurrentCourseId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyCourses = async () => {
            const email = localStorage.getItem('email');
            try {
                const studentDetails = await axios.get(`http://localhost:5148/api/Students/details/${email}`);
                const userId = studentDetails.data.userId;

                const response = await axios.get(`http://localhost:5148/api/Enrollments/my?studentId=${userId}`);
                setMyCourses(response.data);
            } catch (err) {
                console.error("Error fetching my courses:", err.response ? err.response.data : err.message);
            }
        };

        fetchMyCourses();
    }, []);

    const handleModuleNavigation = async (courseId) => {
        setCurrentCourseId(courseId);
        setCurrentModuleIndex(0);
        try {
            const modulesResponse = await axios.get(`http://localhost:5148/api/Modules/course/${courseId}`);
            setCurrentCourseModules(modulesResponse.data);
        } catch (err) {
            console.error("Error fetching modules:", err);
        }
    };

    const handleNextModule = () => {
        if (currentModuleIndex < currentCourseModules.length - 1) {
            setCurrentModuleIndex((prevIndex) => prevIndex + 1);
        }
    };

    const handleDownloadCertificate = async (courseId) => {
        try {
            const response = await axios.get(`http://localhost:5148/api/Certificates/download?courseId=${courseId}`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `certificate_${courseId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error("Error downloading certificate:", err);
        }
    };

    const handleCompleteCourse = (courseId) => {
        handleDownloadCertificate(courseId);
        navigate('/student-dashboard/course-completion');
    };

    return (
        <div style={styles.container}>
            <Typography variant="h4" style={styles.title}>My Courses</Typography>
            {myCourses.length > 0 ? (
                <Paper style={styles.courseList}>
                    <List>
                        {myCourses.map((course) => (
                            <ListItem key={course.enrollmentId}>
                                <ListItemText primary={`Course Title: ${course.courseTitle}`} />
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    onClick={() => handleModuleNavigation(course.courseId)}
                                >
                                    View Modules
                                </Button>
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            ) : (
                <Typography variant="body1">No courses enrolled.</Typography>
            )}

            {currentCourseId && currentCourseModules.length > 0 && (
                <div style={styles.moduleContainer}>
                    <Typography variant="h5">Course Modules</Typography>
                    <Typography variant="h6">Module {currentModuleIndex + 1}</Typography>
                    <Typography variant="body1">{currentCourseModules[currentModuleIndex]?.content}</Typography>
                    {currentModuleIndex < currentCourseModules.length - 1 ? (
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={handleNextModule} 
                            style={styles.nextButton}
                        >
                            Next Module
                        </Button>
                    ) : (
                        <Button 
                            variant="contained" 
                            color="secondary" 
                            onClick={() => handleCompleteCourse(currentCourseId)} 
                            style={styles.nextButton}
                        >
                            Complete Course & Download Certificate
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};

// Define styles
const styles = {
    container: {
        padding: '20px',
        maxWidth: '600px',
        margin: 'auto',
    },
    title: {
        marginBottom: '20px',
    },
    courseList: {
        marginBottom: '20px',
        padding: '10px',
    },
    moduleContainer: {
        marginTop: '20px',
    },
    nextButton: {
        marginTop: '10px',
    },
};

export default MyCourses;
