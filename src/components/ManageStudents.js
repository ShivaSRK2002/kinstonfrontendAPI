// ManageStudents.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ManageStudents.css';
import DashboardLayout from './DashboardLayout'; // Import the layout

const ManageStudents = () => {
    const [pendingStudents, setPendingStudents] = useState([]);

    useEffect(() => {
        const fetchPendingStudents = async () => {
            try {
                const response = await axios.get('http://localhost:5148/api/Students/pending');
                setPendingStudents(response.data);
            } catch (err) {
                console.error('Error fetching pending students:', err);
            }
        };

        fetchPendingStudents();
    }, []);

    const handleApprove = async (id) => {
        try {
            await axios.post(`http://localhost:5148/api/Students/approve/${id}`);
            setPendingStudents(pendingStudents.filter(student => student.userId !== id));
        } catch (err) {
            console.error('Error approving student:', err);
        }
    };

    const handleReject = async (id) => {
        try {
            await axios.post(`http://localhost:5148/api/Students/reject/${id}`);
            setPendingStudents(pendingStudents.filter(student => student.userId !== id));
        } catch (err) {
            console.error('Error rejecting student:', err);
        }
    };

    return (
        <DashboardLayout>
            <div className="management-section">
                <h3 className="section-title">Manage Students</h3>
                {pendingStudents.length > 0 ? (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th className="table-header">Name</th>
                                <th className="table-header">Email</th>
                                <th className="table-header">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingStudents.map((student) => (
                                <tr key={student.userId}>
                                    <td className="table-data">{student.name}</td>
                                    <td className="table-data">{student.email}</td>
                                    <td className="table-data">
                                        <button className="approve-btn" onClick={() => handleApprove(student.userId)}>Approve</button>
                                        <button className="reject-btn" onClick={() => handleReject(student.userId)}>Reject</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No pending student accounts for approval.</p>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ManageStudents;
