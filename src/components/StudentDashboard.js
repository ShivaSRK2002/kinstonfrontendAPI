import React from 'react';
import { AppBar, Toolbar, Typography, Drawer, CssBaseline, List, ListItem, ListItemIcon, ListItemText, Divider, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BookIcon from '@mui/icons-material/Book';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { Link, Outlet, useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const StudentDashboard = () => {
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const navigate = useNavigate();

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleLinkClick = () => {
        setDrawerOpen(false);
    };

    const handleLogout = () => {
        // Perform logout logic here (e.g., clear authentication tokens)
        navigate('/');
    };

    return (
        <div style={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed">
                <Toolbar style={{ minHeight: 48 }}>
                    <MenuIcon onClick={toggleDrawer} style={{ cursor: 'pointer', marginRight: 16 }} />
                    <Typography variant="subtitle1" noWrap component="div">
                        Student Dashboard
                    </Typography>
                    <Button color="inherit" onClick={handleLogout} style={{ marginLeft: 'auto' }}>
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
                    <ListItem button component={Link} to="profile" onClick={handleLinkClick}>
                        <ListItemIcon><AccountCircleIcon /></ListItemIcon>
                        <ListItemText primary="Profile" />
                    </ListItem>
                    <ListItem button component={Link} to="available-courses" onClick={handleLinkClick}>
                        <ListItemIcon><BookIcon /></ListItemIcon>
                        <ListItemText primary="Available Courses" />
                    </ListItem>
                    <ListItem button component={Link} to="my-courses" onClick={handleLinkClick}>
                        <ListItemIcon><SchoolIcon /></ListItemIcon>
                        <ListItemText primary="My Courses" />
                    </ListItem>
                    <ListItem button component={Link} to="course-completion" onClick={handleLinkClick}>
                        <ListItemIcon><AssignmentTurnedInIcon /></ListItemIcon>
                        <ListItemText primary="Completed Courses" />
                    </ListItem>
                </List>
            </Drawer>
            <main style={{ flexGrow: 1, padding: '20px', marginLeft: drawerOpen ? drawerWidth : 0 }}>
                <Toolbar />
                {/* Nested routes will be rendered here */}
                <Outlet />
            </main>
        </div>
    );
};

export default StudentDashboard;
