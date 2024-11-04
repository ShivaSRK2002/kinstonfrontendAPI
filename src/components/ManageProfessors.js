// ManageProfessors.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
//import './ManageProfessors.css'; // Import your CSS for styling
import DashboardLayout from './DashboardLayout'; // Import the layout

const ManageProfessors = () => {
    const [pendingProfessors, setPendingProfessors] = useState([]);

    useEffect(() => {
        const fetchPendingProfessors = async () => {
            try {
                const response = await axios.get('http://localhost:5148/api/Professors/pending');
                setPendingProfessors(response.data);
            } catch (err) {
                console.error('Error fetching pending professors:', err);
            }
        };

        fetchPendingProfessors();
    }, []);

    const handleApprove = async (id) => {
        try {
            await axios.post(`http://localhost:5148/api/Professors/approve/${id}`);
            setPendingProfessors(pendingProfessors.filter(professor => professor.userId !== id));
        } catch (err) {
            console.error('Error approving professor:', err);
        }
    };

    const handleReject = async (id) => {
        try {
            await axios.post(`http://localhost:5148/api/Professors/reject/${id}`);
            setPendingProfessors(pendingProfessors.filter(professor => professor.userId !== id));
        } catch (err) {
            console.error('Error rejecting professor:', err);
        }
    };

    return (
        <DashboardLayout>
            <div className="management-section">
                <h3 className="section-title">Manage Professors</h3>
                {pendingProfessors.length > 0 ? (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th className="table-header">Name</th>
                                <th className="table-header">Email</th>
                                <th className="table-header">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingProfessors.map((professor) => (
                                <tr key={professor.userId}>
                                    <td className="table-data">{professor.name}</td>
                                    <td className="table-data">{professor.email}</td>
                                    <td className="table-data">
                                        <button className="approve-btn" onClick={() => handleApprove(professor.userId)}>Approve</button>
                                        <button className="reject-btn" onClick={() => handleReject(professor.userId)}>Reject</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No pending professor accounts for approval.</p>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ManageProfessors;
