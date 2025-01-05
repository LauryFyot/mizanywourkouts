import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { fetchAllExercises } from "../services/exerciseService";
import { addUserWorkout } from "../services/workoutService";
import { doc } from "firebase/firestore";

// Import reusable components
import ExerciseSelector from "../components/ExerciseSelector";
import SelectedExercises from "../components/SelectedExercises";
import SaveButton from "../components/SaveButton";
import NavigateButton from "../components/NavigateButton";

const CreateWorkout = () => {
  // State for workout details
  const [title, setTitle] = useState("");
  const [exercises, setExercises] = useState([]); // List of all exercises
  const [selectedExercises, setSelectedExercises] = useState([]); // Selected exercises for this workout
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Show all exercises
  const fetchData = async () => {
    try {
      const exerciseList = await fetchAllExercises();
      setExercises(exerciseList); // Populate exercises dropdown
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  };

  // Display selected exercises
  const addExerciseWorkout = (exerciseId, duration, repetitions) => {
    const selectedExercise = exercises.find((ex) => ex.id === exerciseId);
    setSelectedExercises((prev) => [
      ...prev,
      {
        id: doc(db, "exercises", exerciseId), // Firestore doc reference
        name: selectedExercise.name, // Exercise name
        duration: duration ? parseInt(duration) : null,
        repetitions: repetitions ? parseInt(repetitions) : null,
      },
    ]);
  };

  // Save the workout
  const saveWorkout = async () => {
    if (!title || selectedExercises.length === 0) {
      alert("Please add a title and at least one exercise.");
      return;
    }

    try {
      setLoading(true);
      await addUserWorkout(title, selectedExercises); // Save workout to Firestore
      alert("Workout created successfully!");
      navigate("/workouts"); // Redirect to workouts list
    } catch (error) {
      console.error("Error creating workout:", error);
      alert("Failed to create workout.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1>Create Workout</h1>

      {/* Workout Title */}
      <div>
        <label>Title:</label>
        <input type="text" placeholder="Workout Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      {/* Add Exercises */}
      <ExerciseSelector exercises={exercises} addExercise={addExerciseWorkout} />
      <NavigateButton to="/add-exercise" text="Missing an exercise ?" />

      {/* Display Selected Exercises */}
      <SelectedExercises selectedExercises={selectedExercises} />

      {/* Save Button */}
      <div>
        <SaveButton onClick={saveWorkout} loading={loading} text="Save Workout!" />
      </div>
    </div>
  );
};

export default CreateWorkout;
