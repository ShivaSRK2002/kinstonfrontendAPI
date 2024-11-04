import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const AvailableCourses = () => {
    const [courses, setCourses] = useState([]);
    const [myCourses, setMyCourses] = useState([]);
    const [statusMessage, setStatusMessage] = useState('');
    const [studentDetails, setStudentDetails] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get('http://localhost:5148/api/Courses/approved');
                setCourses(response.data);
            } catch (err) {
                console.error("Error fetching courses:", err);
                setStatusMessage("Failed to fetch courses. Please try again later.");
            }
        };

        const fetchStudentDetails = async () => {
            try {
                const email = localStorage.getItem('email');
                const response = await axios.get(`http://localhost:5148/api/Students/details/${email}`);
                setStudentDetails(response.data);
            } catch (err) {
                console.error("Error fetching student details:", err);
                setStatusMessage("Failed to fetch student details. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
        fetchStudentDetails();
    }, []);

    const handleEnrollCourse = async (courseId) => {
        if (myCourses.length > 0) {
            setStatusMessage("Please complete your current course before enrolling in a new one.");
            return;
        }
    
        // Assuming you have a way to fetch course details based on courseId
        const courseDetails = courses.find(course => course.courseId === courseId);
    
        const enrollment = {
            enrollmentId: 0,
            courseId: courseId,
            studentId: studentDetails.userId,
            enrolledAt: new Date().toISOString(),
            rating: 0,
            course: {
                courseId: courseDetails.courseId,
                title: courseDetails.title,
                description: courseDetails.description,
                professorId: courseDetails.professorId, // Make sure this field is available
                startDate: courseDetails.startDate,
                endDate: courseDetails.endDate,
                price: courseDetails.price,
                isApproved: courseDetails.isApproved,
                enrollmentCount: courseDetails.enrollmentCount
            }
        };
    
        console.log("Enrollment Payload:", enrollment);
    
        try {
            const response = await axios.post('http://localhost:5148/api/Enrollments', enrollment);
            console.log("Enrollment Response:", response.data);
            setMyCourses((prev) => [...prev, { courseId }]);
            setStatusMessage(`You have successfully enrolled in the course with ID: ${courseId}`);
        } catch (err) {
            if (err.response) {
                console.error("Error enrolling in the course:", err.response.data);
                if (err.response.data.errors) {
                    // Log validation errors if present
                    const validationErrors = Object.entries(err.response.data.errors)
                        .map(([key, value]) => `${key}: ${value.join(', ')}`)
                        .join('\n');
                    setStatusMessage(`Validation Errors:\n${validationErrors}`);
                } else {
                    setStatusMessage(err.response.data.title || "Error enrolling in the course. Please try again.");
                }
            } else {
                console.error("Error enrolling in the course:", err.message);
                setStatusMessage("Error enrolling in the course. Please try again.");
            }
        }
    };
   

    return (
        <div style={styles.container}>
            <Typography variant="h4" style={styles.title}>Available Courses</Typography>
            {loading ? (
                <Typography variant="body1">Loading courses...</Typography>
            ) : (
                courses.length > 0 ? (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Course Name</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Start Date</TableCell>
                                    <TableCell>End Date</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {courses.map((course) => (
                                    <TableRow key={course.courseId}>
                                        <TableCell>{course.title}</TableCell>
                                        <TableCell>{course.description}</TableCell>
                                        <TableCell>{new Date(course.startDate).toLocaleDateString()}</TableCell>
                                        <TableCell>{new Date(course.endDate).toLocaleDateString()}</TableCell>
                                        <TableCell>${course.price.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                startIcon={<ShoppingCartIcon />}
                                                onClick={() => handleEnrollCourse(course.courseId)} // Updated function name
                                            >
                                                Enroll Now
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Typography variant="body1">No approved courses available at the moment.</Typography>
                )
            )}
            {statusMessage && <Typography variant="body2" style={styles.purchaseStatus}>{statusMessage}</Typography>}
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        maxWidth: '800px',
        margin: 'auto',
    },
    title: {
        color: '#003366',
        marginBottom: '20px',
    },
    purchaseStatus: {
        marginTop: '20px',
        color: '#4caf50',
    },
};

export default AvailableCourses;

