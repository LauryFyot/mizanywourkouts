import React, { useState, useEffect } from "react";
import { getAllUserWorkouts, getWorkoutDetails } from "../services/workoutService"; // Import the helper function
import WorkoutSelector from "../components/WorkoutSelector";
import Timer from "../components/Timer";

const StartWorkout = () => {
  const [workouts, setWorkouts] = useState([]); // List of all workouts
  const [selectedWorkout, setSelectedWorkout] = useState(null); // Currently selected workout
  const [loading, setLoading] = useState(false); // Track loading state for resolving exercises

  // Fetch all workouts on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllUserWorkouts(); // Fetch all workouts for the user
        setWorkouts(data);
      } catch (error) {
        console.error("Error fetching workouts:", error);
      }
    };
    fetchData();
  }, []);

  // Handle workout selection and fetch exercise details
  const handleSelectWorkout = async (workout) => {
    setLoading(true);
    try {
      const detailedWorkout = await getWorkoutDetails(workout.id); // Fetch full exercise details
      setSelectedWorkout(detailedWorkout); // Set the fully resolved workout
    } catch (error) {
      console.error("Error fetching workout details:", error);
    } finally {
      setLoading(false);
    }
  };

  // Exit the timer and return to workout selection
  const handleExit = () => {
    setSelectedWorkout(null); // Clear the selected workout
  };

  return (
    <div>
      {!selectedWorkout ? (
        <>
          <WorkoutSelector
            workouts={workouts}
            onSelectWorkout={handleSelectWorkout} // Use the updated handler
          />
          {loading && <p>Loading workout details...</p>}
        </>
      ) : (
        <Timer
          exercises={selectedWorkout.exercises} // Pass resolved exercises to the Timer
          onExit={handleExit}
        />
      )}
    </div>
  );
};

export default StartWorkout;
