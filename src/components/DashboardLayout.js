import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Drawer,
    CssBaseline,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Button
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { Link, useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const DashboardLayout = ({ children }) => {
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const navigate = useNavigate();

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleLinkClick = () => {
        setDrawerOpen(false);
    };

    const handleLogout = () => {
        // Clear authentication tokens or user data as needed
        // Example: localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div style={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <MenuIcon onClick={toggleDrawer} sx={{ cursor: 'pointer', mr: 2 }} />
                    <Typography variant="subtitle1" noWrap component="div">
                        Admin Dashboard
                    </Typography>
                    <Button color="inherit" onClick={handleLogout} sx={{ ml: 'auto' }}>
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
                    <ListItem button component={Link} to="/admin-dashboard" onClick={handleLinkClick}>
                        <ListItemIcon><AdminPanelSettingsIcon /></ListItemIcon>
                        <ListItemText primary="Admin Dashboard" />
                    </ListItem>
                    <ListItem button component={Link} to="/manage-students" onClick={handleLinkClick}>
                        <ListItemIcon><ManageAccountsIcon /></ListItemIcon>
                        <ListItemText primary="Manage Students" />
                    </ListItem>
                    <ListItem button component={Link} to="/manage-professors" onClick={handleLinkClick}>
                        <ListItemIcon><SchoolIcon /></ListItemIcon>
                        <ListItemText primary="Manage Professors" />
                    </ListItem>
                    <ListItem button component={Link} to="/manage-courses" onClick={handleLinkClick}>
                        <ListItemIcon><AssignmentIcon /></ListItemIcon>
                        <ListItemText primary="Manage Courses" />
                    </ListItem>
                    <ListItem button component={Link} to="/reports" onClick={handleLinkClick}>
                        <ListItemIcon><AssessmentIcon /></ListItemIcon>
                        <ListItemText primary="Reports" />
                    </ListItem>
                </List>
            </Drawer>
            <main style={{
                flexGrow: 1,
                padding: '20px',
                marginLeft: drawerOpen ? drawerWidth : 0,
                transition: 'margin 0.3s ease-in-out',
            }}>
                <Toolbar />
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;
