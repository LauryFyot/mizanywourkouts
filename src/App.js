import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NavBar from "./components/NavBar";
import Workouts from "./pages/Workouts";
import CreateWorkout from "./pages/CreateWorkout";
import StartWorkout from "./pages/StartWorkout";
import ShowWorkout from "./pages/ShowWorkout";
import CreateExercise from "./pages/CreateExercise";
import EditWorkout from "./pages/EditWorkout";
import { WorkoutProvider } from "./context/WorkoutContext";

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
    <WorkoutProvider>
      <Router>
        <NavBar /> {/* Display the navigation bar at the top */}
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
            path="/start-workout"
            element={
              <ProtectedRoute>
                <StartWorkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/show-workout/:id"
            element={
              <ProtectedRoute>
                <ShowWorkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-exercise"
            element={
              <ProtectedRoute>
                <CreateExercise />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-workout/:id"
            element={
              <ProtectedRoute>
                <EditWorkout />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </WorkoutProvider>
  );
};

export default App;
