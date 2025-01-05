import React, { useEffect, useState } from "react";
import { getAllUserWorkouts, deleteWorkoutById } from "../services/workoutService";
import { Link, useNavigate } from "react-router-dom";

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch workouts
  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllUserWorkouts();
      setWorkouts(data);
    };
    fetchData();
  }, []);

  // Delete Workout
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this workout?");
    if (!confirmDelete) return;

    setLoading(true);
    try {
      await deleteWorkoutById(id); // Call delete function from service
      setWorkouts((prev) => prev.filter((workout) => workout.id !== id)); // Remove workout from UI
    } catch (error) {
      console.error("Error deleting workout:", error);
      alert("Failed to delete workout.");
    } finally {
      setLoading(false);
    }
  };

  // Navigate to Edit Workout Page
  const handleEdit = (id) => {
    navigate(`/edit-workout/${id}`); // Navigate to edit page
  };

  return (
    <div>
      <h1>Workouts</h1>
      <Link to="/create-workout">+ Create Workout</Link>
      <ul>
        {workouts.map((workout) => (
          <li key={workout.id}>
            <Link to={`/start-workout/${workout.id}`}>{workout.title}</Link>
            <button onClick={() => handleEdit(workout.id)} style={{ marginLeft: "10px" }}>
              Edit
            </button>
            <button
              onClick={() => handleDelete(workout.id)}
              style={{ marginLeft: "10px", color: "red" }}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Workouts;
