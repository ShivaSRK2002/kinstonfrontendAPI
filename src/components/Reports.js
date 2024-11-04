// Reports.js
import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, CssBaseline, Button, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssessmentIcon from '@mui/icons-material/Assessment'; // Importing an icon for reports
import { jwtDecode } from 'jwt-decode';
import axios from 'axios'; // Make sure axios is imported

const drawerWidth = 240;

const Reports = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [courseData, setCourseData] = useState([]);
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const getCurrentUserFromToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setCurrentUser(decodedToken);
    }
  };

  useEffect(() => {
    getCurrentUserFromToken();
    fetchCourseReports(); // Fetch course reports on component mount
  }, []);

  const fetchCourseReports = async () => {
    try {
      const response = await axios.get('http://localhost:5148/api/reports/courses'); // Update with the correct API endpoint
      setCourseData(response.data);
    } catch (err) {
      console.error('Error fetching course reports:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div style={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <Button color="inherit" onClick={toggleDrawer}>
            <AssessmentIcon />
          </Button>
          <Typography variant="h6" noWrap component="div">
            Reports
          </Typography>
          <Button color="inherit" onClick={handleLogout} sx={{ marginLeft: 'auto' }}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="temporary"
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
      >
        <Toolbar />
        <List>
          <ListItem button component={Link} to="/manage-students">
            <ListItemIcon>
              <ManageAccountsIcon />
            </ListItemIcon>
            <ListItemText primary="Manage Students" />
          </ListItem>
          <ListItem button component={Link} to="/manage-professors">
            <ListItemIcon>
              <SchoolIcon />
            </ListItemIcon>
            <ListItemText primary="Manage Professors" />
          </ListItem>
          <ListItem button component={Link} to="/manage-courses">
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Manage Courses" />
          </ListItem>
          <ListItem button component={Link} to="/reports">
            <ListItemIcon>
              <AssessmentIcon />
            </ListItemIcon>
            <ListItemText primary="Reports" />
          </ListItem>
        </List>
      </Drawer>
      <main style={{ flexGrow: 1, padding: '24px', marginLeft: drawerOpen ? drawerWidth : 0 }}>
        <Typography variant="h4" gutterBottom>
          Courses and Enrolled Students
        </Typography>
        {courseData.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th className="table-header">Course Name</th>
                <th className="table-header">Enrolled Students</th>
              </tr>
            </thead>
            <tbody>
              {courseData.map((course) => (
                <tr key={course.courseId}>
                  <td className="table-data">{course.courseName}</td>
                  <td className="table-data">
                    {course.students.length > 0 ? (
                      course.students.map((student, index) => (
                        <div key={student.studentId}>
                          {student.name}{index < course.students.length - 1 && ', '}
                        </div>
                      ))
                    ) : (
                      'No students enrolled'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No course data available.</p>
        )}
      </main>
    </div>
  );
};

export default Reports;
