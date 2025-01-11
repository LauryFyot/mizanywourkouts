import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import SaveButton from "../components/SaveButton";
import ExerciseSelector from "../components/ExerciseSelector";
import { fetchAllExercises } from "../services/exerciseService";
import { Reorder } from "framer-motion"; // Import Reorder from Framer Motion

const EditWorkout = () => {
  const { id } = useParams(); // Get workout ID from URL
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [exercises, setExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch workout and exercises
  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        // Get workout ref id & get document object
        const workoutRef = doc(db, "workouts", id);
        const workoutDoc = await getDoc(workoutRef);
        // If workout data is found > set title, set exercises
        if (workoutDoc.exists()) {
          const data = workoutDoc.data();
          setTitle(data.title);
          setSelectedExercises(
            (data.exercises || []).map((exercise) => ({
              ...exercise,
              id: typeof exercise.id === "string" ? exercise.id : exercise.id.id, // Ensure ID is string
            }))
          );
        } else {
          alert("Workout not found!");
          navigate("/workouts");
        }

        const allExercises = await fetchAllExercises();
        setExercises(allExercises);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to fetch data.");
      }
    };
    fetchWorkout();
  }, [id, navigate]);

  // Add Exercise
  const addExerciseWorkout = (exerciseId, duration, repetitions) => {
    const selectedExercise = exercises.find((ex) => ex.id === exerciseId);
    setSelectedExercises((prev) => [
      ...prev,
      {
        id: selectedExercise.id,
        name: selectedExercise.name,
        duration: duration ? parseInt(duration) : null,
        repetitions: repetitions ? parseInt(repetitions) : null,
      },
    ]);
  };

  // Remove Exercise
  const removeExercise = (exerciseId) => {
    setSelectedExercises((prev) => prev.filter((ex) => ex.id !== exerciseId));
  };

  // Save Changes
  const handleSave = async () => {
    if (!title || selectedExercises.length === 0) {
      alert("Please add a title and at least one exercise.");
      return;
    }

    try {
      setLoading(true);
      const workoutRef = doc(db, "workouts", id);
      // Convert exercise IDs to Firestore references
      const formattedExercises = selectedExercises.map((exercise) => ({
        id: doc(db, "exercises", exercise.id), // Convert string to Firestore reference
        duration: exercise.duration,
        repetitions: exercise.repetitions,
      }));

      // Update the workout with formatted exercises
      await updateDoc(workoutRef, {
        title,
        exercises: formattedExercises,
      });
      alert("Workout updated successfully!");
      navigate("/workouts");
    } catch (error) {
      console.error("Error updating workout:", error);
      alert("Failed to update workout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Edit Workout</h1>

      {/* Title */}
      <div>
        <label>Title:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      {/* Add Exercises */}
      <ExerciseSelector exercises={exercises} addExercise={addExerciseWorkout} />

      {/* Reorder Exercises */}
      <h2>Selected Exercises:</h2>
      <Reorder.Group
        axis="y"
        values={selectedExercises}
        onReorder={setSelectedExercises} // Handles reordering automatically
        style={{ listStyle: "none", padding: 0 }}
      >
        {selectedExercises.map((exercise) => (
          <Reorder.Item
            key={exercise.id}
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
              {exercise.name} - {exercise.duration ? `${exercise.duration}s` : ""} {exercise.repetitions ? `${exercise.repetitions} reps` : ""}
            </span>
            <button onClick={() => removeExercise(exercise.id)} style={{ color: "red", marginLeft: "10px" }}>
              Remove
            </button>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {/* Save Button */}
      <SaveButton onClick={handleSave} loading={loading} text="Save Changes" />
    </div>
  );
};

export default EditWorkout;
