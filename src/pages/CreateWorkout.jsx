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
import { useWorkout } from "../context/WorkoutContext";

const CreateWorkout = () => {
  const { title, setTitle, selectedExercises, setSelectedExercises } = useWorkout(); // Use context
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Fetch exercises
  const fetchData = async () => {
    try {
      const exerciseList = await fetchAllExercises();
      setExercises(exerciseList); // Populate exercises dropdown
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  };

  const addExerciseWorkout = (exerciseId, duration, repetitions) => {
    const selectedExercise = exercises.find((ex) => ex.id === exerciseId);
    setSelectedExercises((prev) => [
      ...prev,
      {
        id: doc(db, "exercises", exerciseId),
        name: selectedExercise.name,
        duration: duration ? parseInt(duration) : null,
        repetitions: repetitions ? parseInt(repetitions) : null,
      },
    ]);
  };

  const saveWorkout = async () => {
    if (!title || selectedExercises.length === 0) {
      alert("Please add a title and at least one exercise.");
      return;
    }

    try {
      setLoading(true);
      await addUserWorkout(title, selectedExercises); // Save workout to Firestore
      alert("Workout created successfully!");
      navigate("/workouts");
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

      <div>
        <label>Title:</label>
        <input
          type="text"
          placeholder="Workout Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <ExerciseSelector exercises={exercises} addExercise={addExerciseWorkout} />
      <NavigateButton to="/add-exercise" text="Missing an exercise ?" />
      <SelectedExercises selectedExercises={selectedExercises} />
      <SaveButton onClick={saveWorkout} loading={loading} text="Save Workout!" />
    </div>
  );
};

export default CreateWorkout;
