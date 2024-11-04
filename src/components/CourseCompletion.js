import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, ListItem, Typography, Paper, Button } from '@mui/material';
import jsPDF from 'jspdf'; // Import jsPDF

const CourseCompletion = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [studentName, setStudentName] = useState('');

    useEffect(() => {
        const fetchEnrolledCourses = async () => {
            try {
                const email = localStorage.getItem('email');  // Get email from local storage
                const studentResponse = await axios.get(`http://localhost:5148/api/Students/details/${email}`);
                const studentId = studentResponse.data.userId; // Extract studentId from response

                // Set student name
                setStudentName(studentResponse.data.name); // Assuming the student object contains a name property

                // Fetch the course IDs and titles for the student
                const coursesResponse = await axios.get(`http://localhost:5148/api/Enrollments/courses/${studentId}`);
                setCourses(coursesResponse.data);  // Assuming response contains an array of { courseId, courseTitle }
            } catch (err) {
                console.error("Error fetching enrolled courses:", err);
                setError(err.response ? err.response.data : "Failed to load courses.");
            } finally {
                setLoading(false);
            }
        };

        fetchEnrolledCourses();
    }, []);

    const handleDownloadCertificate = (courseTitle) => {
        const doc = new jsPDF();
    
        // Set background color
        doc.setFillColor(240, 240, 240);
        doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');
    
        // Add a decorative border
        doc.setLineWidth(6);
        doc.setDrawColor(0, 102, 204); // Blue border
        doc.rect(10, 10, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 20);
    
        // Title
        doc.setFontSize(32);
        doc.setTextColor(0, 102, 204); // Title color
        doc.text("Certificate of Completion", 105, 50, { align: "center" });
    
        // University name
        doc.setFontSize(28);
        doc.setTextColor(50, 50, 50); // Dark gray for university name
        doc.text("ShivaE University", 105, 90, { align: "center" });
    
        // Spacer
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0); // Black for normal text
        doc.text("", 105, 115); // Empty text for spacing
    
        // Student name
        doc.setFontSize(22);
        doc.setTextColor(0, 0, 0);
        doc.text("This certifies that", 105, 130, { align: "center" });
    
        doc.setFontSize(26);
        doc.setFont("times", "bold"); // Change font style
        doc.text(studentName, 105, 160, { align: "center" });
    
        // Course completion text
        doc.setFontSize(20);
        doc.setFont("times", "normal");
        doc.setTextColor(50, 50, 50);
        doc.text("has successfully completed the course", 105, 190, { align: "center" });
    
        // Course title
        doc.setFontSize(26);
        doc.setFont("times", "bold");
        doc.text(courseTitle, 105, 220, { align: "center" });
    
        // Congratulations message
        doc.setFontSize(22);
        doc.setTextColor(0, 102, 204);
        doc.text("Congratulations!", 105, 250, { align: "center" });
    
        // Add decorative elements (e.g., stars or lines)
        doc.setDrawColor(0, 102, 204);
        doc.setLineWidth(2);
        doc.line(20, 280, 190, 280); // Decorative line
    
        // Save the PDF
        doc.save(`Certificate_${courseTitle}.pdf`);
    };
    

    if (loading) {
        return <p>Loading courses...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div style={styles.container}>
            <Typography variant="h4" style={styles.title}>Completed Courses</Typography>
            {courses.length > 0 ? (
                <Paper style={styles.courseList}>
                    <List>
                        {courses.map((course, index) => (
                            <ListItem key={index} style={styles.courseItem}>
                                <Typography variant="body1">
                                    {course.courseTitle} {/* Display only the course title */}
                                </Typography>
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    style={styles.downloadButton} 
                                    onClick={() => handleDownloadCertificate(course.courseTitle)}
                                >
                                    Download Certificate
                                </Button>
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            ) : (
                <Typography variant="body1">No enrolled courses found.</Typography>
            )}
        </div>
    );
};

// Define styles (adjust as needed)
const styles = {
    container: {
        padding: '20px',
        maxWidth: '600px',
        margin: 'auto',
    },
    title: {
        marginBottom: '20px',
        textAlign: 'center',
    },
    courseList: {
        padding: '10px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
    },
    downloadButton: {
        marginLeft: 'auto', // Push button to the right
    },
    courseItem: {
        display: 'flex',
        justifyContent: 'space-between', // Aligns text and button
        alignItems: 'center',
        marginBottom: '10px', // Add some space between items
    },
};

export default CourseCompletion;
