import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
    const [studentDetails, setStudentDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudentDetails = async () => {
            try {
                const email = localStorage.getItem('email');
                const response = await axios.get(`http://localhost:5148/api/Students/details/${email}`);
                setStudentDetails(response.data);
            } catch (err) {
                console.error("Error fetching student details:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStudentDetails();
    }, []);

    if (loading) {
        return <p>Loading student details...</p>;
    }

    return (
        <div style={styles.container}>
            <h3 style={styles.title}>Profile</h3>
            {studentDetails ? (
                <div style={styles.detailsContainer}>
                    <p style={styles.detailItem}>Name: <span style={styles.detailValue}>{studentDetails.name}</span></p>
                    <p style={styles.detailItem}>Email: <span style={styles.detailValue}>{studentDetails.email}</span></p>
                    <p style={styles.detailItem}>User ID: <span style={styles.detailValue}>{studentDetails.userId}</span></p>
                </div>
            ) : (
                <p>No student details found.</p>
            )}
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: '#f9f9f9',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        maxWidth: '600px',
        margin: 'auto',
    },
    title: {
        color: '#003366', // Dark blue
        textAlign: 'center',
    },
    detailsContainer: {
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #ddd',
    },
    detailItem: {
        margin: '10px 0',
        fontSize: '16px',
        color: '#333',
    },
    detailValue: {
        fontWeight: 'bold',
        color: '#003366', // Dark blue
    },
};

export default Profile;
