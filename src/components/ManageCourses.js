// ManageCourses.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from './DashboardLayout'; // Import the layout

const ManageCourses = () => {
    const [pendingCourses, setPendingCourses] = useState([]);

    useEffect(() => {
        const fetchPendingCourses = async () => {
            try {
                const response = await axios.get('http://localhost:5148/api/Courses/pending');
                console.log('Fetched pending courses:', response.data); // Log fetched data
                setPendingCourses(response.data); // Set the fetched pending courses
            } catch (err) {
                console.error('Error fetching pending courses:', err);
            }
        };

        fetchPendingCourses();
    }, []);

    const handleApprove = async (id) => {
        try {
            await axios.post(`http://localhost:5148/api/Courses/approve/${id}`);
            // Update the pendingCourses state by filtering out the approved course
            setPendingCourses(pendingCourses.filter(course => course.courseId !== id));
        } catch (err) {
            console.error('Error approving course:', err);
        }
    };

    const handleReject = async (id) => {
        try {
            await axios.post(`http://localhost:5148/api/Courses/reject/${id}`);
            // Update the pendingCourses state by filtering out the rejected course
            setPendingCourses(pendingCourses.filter(course => course.courseId !== id));
        } catch (err) {
            console.error('Error rejecting course:', err);
        }
    };

    return (
        <DashboardLayout>
            <div className="management-section">
                <h3 className="section-title">Manage Courses</h3>
                {pendingCourses.length > 0 ? (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th className="table-header">Course Title</th>
                                <th className="table-header">Description</th>
                                <th className="table-header">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingCourses.map((course) => (
                                <tr key={course.courseId}>
                                    <td className="table-data">{course.title}</td>
                                    <td className="table-data">{course.description}</td>
                                    <td className="table-data">
                                        <button className="approve-btn" onClick={() => handleApprove(course.courseId)}>Approve</button>
                                        <button className="reject-btn" onClick={() => handleReject(course.courseId)}>Reject</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No pending courses for approval.</p>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ManageCourses;
