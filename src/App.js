import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {useAuth} from './hooks/useAuth';
import Login from './pages/Login';
import Register from './pages/Register';
import Workouts from './pages/Workouts';
import CreateWorkout from './pages/CreateWorkout';
import StartWorkout from './pages/StartWorkout';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // Show a loading spinner or message while auth state is resolving
    return <div>Loading...</div>;
  }

  if (!user) {
    console.log("User is null. Redirecting to login.");
    return <Navigate to="/login" />;
  }

  return children;
};


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/workouts"
          element={
            <ProtectedRoute>
              <Workouts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-workout"
          element={
            <ProtectedRoute>
              <CreateWorkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/start-workout/:id"
          element={
            <ProtectedRoute>
              <StartWorkout />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
