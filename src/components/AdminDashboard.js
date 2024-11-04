import React, { useState, useEffect } from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom'; 
import {
  AppBar,
  Drawer,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Divider,
  IconButton,
  Button,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssessmentIcon from '@mui/icons-material/Assessment'; // Import an icon for reports
import ManageStudents from './ManageStudents'; 
import ManageProfessors from './ManageProfessors'; 
import ManageCourses from './ManageCourses'; 
import Reports from './Reports';
import './AdminDashboard.css'; 
import axios from 'axios'; 
import { jwtDecode } from 'jwt-decode'; 

const drawerWidth = 240;

const AdminDashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState(false); 
  const [users, setUsers] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [currentUser, setCurrentUser] = useState({}); 
  const navigate = useNavigate(); 

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLinkClick = () => {
    setDrawerOpen(false); 
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5148/api/admin/all-users'); 
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false); 
    }
  };

  const getCurrentUserFromToken = () => {
    const token = localStorage.getItem('token'); 
    if (token) {
      const decodedToken = jwtDecode(token);
      setCurrentUser(decodedToken); 
    }
  };

  useEffect(() => {
    fetchUsers();
    getCurrentUserFromToken();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/'); 
  };

  // Separate functions for enabling and suspending a user
  const enableUser = async (userId) => {
    try {
      await axios.put(`http://localhost:5148/api/admin/enable-user/${userId}`);
      setUsers(prevUsers =>
        prevUsers.map(group => ({
          ...group,
          users: group.users.map(user =>
            user.id === userId ? { ...user, isActive: true } : user
          ),
        }))
      );
    } catch (error) {
      console.error('Error enabling user:', error);
    }
  };

  const suspendUser = async (userId) => {
    try {
      await axios.put(`http://localhost:5148/api/admin/suspend-user/${userId}`);
      setUsers(prevUsers =>
        prevUsers.map(group => ({
          ...group,
          users: group.users.map(user =>
            user.id === userId ? { ...user, isActive: false } : user
          ),
        }))
      );
    } catch (error) {
      console.error('Error suspending user:', error);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={toggleDrawer}
            sx={{ mr: 2 }} 
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ fontSize: '1rem' }}>
            Admin Dashboard
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
        <Divider />
        <List>
          <ListItem button component={Link} to="/manage-students" onClick={handleLinkClick}>
            <ListItemIcon>
              <ManageAccountsIcon />
            </ListItemIcon>
            <ListItemText primary="Manage Students" />
          </ListItem>
          <ListItem button component={Link} to="/manage-professors" onClick={handleLinkClick}>
            <ListItemIcon>
              <SchoolIcon />
            </ListItemIcon>
            <ListItemText primary="Manage Professors" />
          </ListItem>
          <ListItem button component={Link} to="/manage-courses" onClick={handleLinkClick}>
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Manage Courses" />
          </ListItem>
          <ListItem button component={Link} to="/reports" onClick={handleLinkClick}>
            <ListItemIcon>
              <AssessmentIcon />
            </ListItemIcon>
            <ListItemText primary="Reports" />
          </ListItem>
        </List>
      </Drawer>
      <main style={{ flexGrow: 1, padding: '24px', marginLeft: drawerOpen ? drawerWidth : 0 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="h5" gutterBottom>
          Welcome, {currentUser.username || 'User'}
        </Typography>
        {loading ? (
          <Typography variant="h6">Loading users...</Typography>
        ) : (
          <div>
            {users.length > 0 ? (
              users.map(group => (
                <div key={group.role}>
                  <Typography variant="h5" gutterBottom>
                    {group.role}s
                  </Typography>
                  <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '20px' }}>
                    {group.users.map(user => (
                      <div key={user.id} style={{ margin: '10px 0', padding: '10px', border: '1px solid #ccc' }}>
                        <Typography variant="body1">
                          {user.name} - {user.email} ({user.isActive ? 'Active' : 'Inactive'})
                        </Typography>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => enableUser(user.id)}
                          disabled={user.isActive} // Disable "Enable" button if already active
                          sx={{ mt: 1, mr: 2 }}
                        >
                          Enable
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => suspendUser(user.id)}
                          disabled={!user.isActive} // Disable "Suspend" button if already inactive
                          sx={{ mt: 1 }}
                        >
                          Suspend
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <Typography variant="body1">No users found.</Typography>
            )}
          </div>
        )}
        <Routes>
          <Route path="/manage-students" element={<ManageStudents />} />
          <Route path="/manage-professors" element={<ManageProfessors />} />
          <Route path="/manage-courses" element={<ManageCourses />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
