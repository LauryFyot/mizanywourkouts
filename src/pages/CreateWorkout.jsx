import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, addDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebase"; // Ensure firebaseConfig is properly set up

const CreateWorkout = () => {
  const [title, setTitle] = useState("");
  const [exercises, setExercises] = useState([]); // All exercises fetched
  const [selectedExercises, setSelectedExercises] = useState([]); // Exercises added to the workout
  const [exerciseId, setExerciseId] = useState(""); // Current selection
  const [duration, setDuration] = useState("");
  const [repetitions, setRepetitions] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Fetch exercises from Firestore
  useEffect(() => {
    const fetchExercises = async () => {
      const querySnapshot = await getDocs(collection(db, "exercises"));
      const exerciseList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setExercises(exerciseList);
    };
    fetchExercises();
  }, []);

  // Add selected exercise to workout
  const addExerciseWorkout = () => {
    if (!exerciseId || (!duration && !repetitions)) {
      alert("Please select an exercise and specify duration or repetitions.");
      return;
    }

    const selectedExercise = exercises.find(ex => ex.id === exerciseId);
    setSelectedExercises([
      ...selectedExercises,
      {
        id: doc(db, "exercises", exerciseId),
        name: selectedExercise.name,
        duration: duration ? parseInt(duration) : null,
        repetitions: repetitions ? parseInt(repetitions) : null,
      },
    ]);

    // Clear input fields
    setExerciseId("");
    setDuration("");
    setRepetitions("");
  };

  // Save workout to Firestore
  const saveWorkout = async () => {
    if (!title || selectedExercises.length === 0) {
      alert("Please add a title and at least one exercise.");
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser; // Get the logged-in user
      await addDoc(collection(db, "workouts"), {
        title,
        exercises: selectedExercises.map(ex => ({
          id: ex.id,
          duration: ex.duration,
          repetitions: ex.repetitions,
        })),
        userId: doc(db, "users", user.uid), // Store user-specific workouts
        createdAt: new Date(),
      });

      alert("Workout created successfully!");
      navigate("/workouts"); // Redirect to workouts page
    } catch (error) {
      console.error("Error creating workout:", error);
      alert("Failed to create workout.");
    } finally {
      setLoading(false);
    }
  };

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

      <div>
        <h2>Add Exercises:</h2>
        <select
          value={exerciseId}
          onChange={(e) => setExerciseId(e.target.value)}
        >
          <option value="">Select Exercise</option>
          {exercises.map((exercise) => (
            <option key={exercise.id} value={exercise.id}>
              {exercise.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Duration (sec)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
        <input
          type="number"
          placeholder="Reps"
          value={repetitions}
          onChange={(e) => setRepetitions(e.target.value)}
        />
        <button onClick={addExerciseWorkout}>Add Exercise</button>
      </div>

      <div>
        <h2>Selected Exercises:</h2>
        {selectedExercises.length === 0 && <p>No exercises added.</p>}
        <ul>
          {selectedExercises.map((exercise, index) => (
            <li key={index}>
              {exercise.name} - {exercise.duration ? `${exercise.duration}s` : ""}{" "}
              {exercise.repetitions ? `${exercise.repetitions} reps` : ""}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <button disabled={loading} onClick={saveWorkout}>
          {loading ? "Saving..." : "Save Workout"}
        </button>
      </div>
    </div>
  );
};

export default CreateWorkout;
