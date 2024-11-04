import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import ProfessorDashboard from './components/ProfessorDashboard';
import StudentDashboard from './components/StudentDashboard';
import Profile from './components/Profile';
import AvailableCourses from './components/AvailableCourses';
import MyCourses from './components/MyCourses'; // Make sure this component exists
import CourseCompletion from './components/CourseCompletion';
import ProtectedRoute from './components/ProtectedRoute';
import ManageStudents from './components/ManageStudents';
import ManageProfessors from './components/ManageProfessors';
import ManageCourses from './components/ManageCourses';
import CreateCourse from './components/CreateCourse';
import Reports from './components/Reports';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Dashboard Route */}
        <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

        {/* Professor Dashboard Routes */}
        <Route path="/professor-dashboard" element={<ProtectedRoute><ProfessorDashboard /></ProtectedRoute>} />
        <Route path="/professor-dashboard/create-course" element={<ProtectedRoute><CreateCourse /></ProtectedRoute>} />
        <Route path="/professor-dashboard/my-courses" element={<ProtectedRoute><MyCourses /></ProtectedRoute>} /> {/* Added MyCourses route */}

        {/* Student Dashboard with Nested Routes */}
        <Route path="/student-dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>}>
          <Route path="profile" element={<Profile />} />
          <Route path="available-courses" element={<AvailableCourses />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="course-completion" element={<CourseCompletion />} />
        </Route>

        {/* Manage Routes for Admin */}
        <Route path="/manage-students" element={<ProtectedRoute><ManageStudents /></ProtectedRoute>} />
        <Route path="/manage-professors" element={<ProtectedRoute><ManageProfessors /></ProtectedRoute>} />
        <Route path="/manage-courses" element={<ProtectedRoute><ManageCourses /></ProtectedRoute>} />
        <Route path="/reports" element={<Reports />} /> {/* New Route for Reports */}
      </Routes>
    </Router>
  );
};

export default App;
