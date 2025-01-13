import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { fetchAllExercises } from "../services/exerciseService";
import { addUserWorkout } from "../services/workoutService";
import { doc } from "firebase/firestore";
import { Reorder } from "framer-motion";
import { v4 as uuidv4 } from "uuid";


// Import reusable components
import ExerciseSelector from "../components/ExerciseSelector";
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

  // Add an exercise to the workout
  const addExerciseWorkout = (exerciseId, duration, repetitions) => {
    const selectedExercise = exercises.find((ex) => ex.id === exerciseId);
    setSelectedExercises((prev) => [
      ...prev,
      {
        key: uuidv4(),
        id: doc(db, "exercises", exerciseId),
        name: selectedExercise.name,
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

      {/* Title Input */}
      <div>
        <label>Title:</label>
        <input
          type="text"
          placeholder="Workout Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Exercise Selector */}
      <ExerciseSelector exercises={exercises} addExercise={addExerciseWorkout} />

      {/* Missing Exercise Navigation */}
      <NavigateButton to="/add-exercise" text="Missing an exercise ?" />

      {/* Selected Exercises with Reordering */}
      <h2>Selected Exercises:</h2>
      <Reorder.Group
        axis="y"
        values={selectedExercises}
        onReorder={setSelectedExercises} // Update the order in state
        style={{ listStyle: "none", padding: 0 }}
      >
        {selectedExercises.map((exercise) => (
          <Reorder.Item
            key={exercise.key}
            value={exercise} // Required for reordering
            style={{
              padding: "10px",
              margin: "5px 0",
              border: "1px solid #ddd",
              borderRadius: "5px",
              backgroundColor: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>
              {exercise.name} - {exercise.duration ? `${exercise.duration}s` : ""}{" "}
              {exercise.repetitions ? `${exercise.repetitions} reps` : ""}
            </span>
            <button
              onClick={() =>
                setSelectedExercises((prev) => prev.filter((ex) => ex.id !== exercise.id))
              }
              style={{ color: "red", marginLeft: "10px" }}
            >
              Remove
            </button>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {/* Save Button */}
      <SaveButton onClick={saveWorkout} loading={loading} text="Save Workout!" />
    </div>
  );
};

export default CreateWorkout;
