import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import SaveButton from "../components/SaveButton";
import ExerciseSelector from "../components/ExerciseSelector";
import { fetchAllExercises } from "../services/exerciseService";
import { Reorder } from "framer-motion"; // Import Reorder from Framer Motion

const ShowWorkout = () => {
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

  return (
    <div>
      <h1>Show Workout</h1>

      {/* Title */}
      <div>
        <label>Title:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
    </div>
  );
};

export default ShowWorkout;
