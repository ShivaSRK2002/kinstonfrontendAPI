import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaSignOutAlt } from 'react-icons/fa';
import {jwtDecode} from 'jwt-decode';
import jsPDF from 'jspdf';

const ProfessorDashboard = () => {
    const navigate = useNavigate();

    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');

    const [courses, setCourses] = useState([]);
    const [enrollmentReport, setEnrollmentReport] = useState([]);

    let userId = null;
    if (token) {
        const decodedToken = jwtDecode(token);
        userId = decodedToken.id;
    }

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(`http://localhost:5148/api/Professors/${userId}/my-courses`);
                setCourses(response.data);
                setEnrollmentReport(response.data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        if (userId) {
            fetchCourses();
        }
    }, [userId]);

    const generateReport = () => {
        setEnrollmentReport(courses);

        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text('Enrollment Report', 10, 10);
        doc.setFontSize(12);

        let yOffset = 20;

        enrollmentReport.forEach((enrollment, index) => {
            doc.text(`Course Title: ${enrollment.title}`, 10, yOffset);
            yOffset += 10;
            doc.text(`Student IDs: ${enrollment.studentIds.length > 0 ? enrollment.studentIds.join(', ') : 'No students enrolled'}`, 10, yOffset);
            yOffset += 10;
            doc.text(`Enrollment Dates: ${new Date(enrollment.startDate).toLocaleDateString()} to ${new Date(enrollment.endDate).toLocaleDateString()}`, 10, yOffset);
            yOffset += 20; // Add extra space between courses
            if (yOffset > 280) { // Add new page if necessary
                doc.addPage();
                yOffset = 20;
            }
        });

        // Download the PDF
        doc.save('Enrollment_Report.pdf');
    };

    return (
        <div style={styles.dashboardContainer}>
            <header style={styles.header}>
                <h2 style={styles.headerTitle}>Professor Dashboard</h2>
                <button style={styles.logoutButton} onClick={handleLogout}>
                    <FaSignOutAlt size={20} style={styles.logoutIcon} /> Logout
                </button>
            </header>

            <p style={styles.welcomeMessage}>Welcome, {username}</p>

            <nav style={styles.nav}>
                <Link to="/professor-dashboard/create-course" style={styles.navLink}>
                    Create Course
                </Link>
            </nav>

            <main style={styles.mainContent}>
                <h3 style={styles.subHeading}>My Courses</h3>
                {courses.length > 0 ? (
                    <div style={styles.cardContainer}>
                        {courses.map((course) => (
                            <div key={course.courseId} style={styles.card}>
                                <h4 style={styles.cardTitle}>{course.title}</h4>
                                <p>{course.description}</p>
                                <p><strong>Start Date:</strong> {new Date(course.startDate).toLocaleDateString()}</p>
                                <p><strong>End Date:</strong> {new Date(course.endDate).toLocaleDateString()}</p>
                                <p><strong>Price:</strong> ${course.price}</p>
                                <p><strong>Student IDs:</strong> {course.studentIds.length > 0 ? course.studentIds.join(', ') : 'No students enrolled'}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No courses created yet.</p>
                )}

                <h3 style={styles.subHeading}>Reports</h3>
                <button onClick={generateReport} style={styles.reportButton}>
                    Generate Enrollment Report
                </button>
                {enrollmentReport.length > 0 && (
                    <div style={styles.reportContainer}>
                        <h4>Enrollment Report</h4>
                        {enrollmentReport.map((enrollment) => (
                            <div key={enrollment.courseId} style={styles.enrollmentCard}>
                                <p><strong>Course Title:</strong> {enrollment.title}</p>
                                <p><strong>Student IDs:</strong> {enrollment.studentIds.length > 0 ? enrollment.studentIds.join(', ') : 'No students enrolled'}</p>
                                <p><strong>Enrollment Dates:</strong> {new Date(enrollment.startDate).toLocaleDateString()} to {new Date(enrollment.endDate).toLocaleDateString()}</p>
                                <hr />
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

const styles = {
    dashboardContainer: {
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: '#f4f4f4',
        height: '100vh',
        overflowX: 'hidden',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#007bff',
        padding: '10px 20px',
        color: '#fff',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1000,
    },
    headerTitle: {
        margin: 0,
        fontSize: '24px',
        fontWeight: 'bold',
    },
    logoutButton: {
        backgroundColor: 'transparent',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        fontSize: '16px',
        padding: '5px 10px',
        transition: 'color 0.3s ease',
    },
    logoutIcon: {
        marginRight: '8px',
    },
    welcomeMessage: {
        fontSize: '18px',
        margin: '80px 0 20px',
        textAlign: 'center',
    },
    nav: {
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        marginBottom: '20px',
        marginTop: '20px',
    },
    navLink: {
        textDecoration: 'none',
        color: '#007bff',
        fontWeight: 'bold',
        fontSize: '18px',
        transition: 'color 0.3s ease',
    },
    mainContent: {
        flex: 1,
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        marginTop: '100px',
        overflowY: 'auto',
    },
    subHeading: {
        margin: '10px 0',
        fontSize: '20px',
    },
    cardContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '15px',
    },
    card: {
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s ease-in-out',
    },
    cardTitle: {
        margin: '0 0 10px',
        fontWeight: 'bold',
    },
    reportButton: {
        backgroundColor: '#007bff',
        color: '#fff',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        margin: '20px 0',
        fontSize: '16px',
        transition: 'background-color 0.3s ease',
    },
    reportContainer: {
        marginTop: '20px',
    },
    enrollmentCard: {
        backgroundColor: '#f1f1f1',
        padding: '10px',
        borderRadius: '5px',
        margin: '10px 0',
    },
};

export default ProfessorDashboard;
