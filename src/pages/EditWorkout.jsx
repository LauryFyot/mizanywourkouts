import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import SaveButton from "../components/SaveButton";

const EditWorkout = () => {
  const { id } = useParams(); // Get workout ID from URL
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch workout data
  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const workoutRef = doc(db, "workouts", id);
        const workoutDoc = await getDoc(workoutRef);
        if (workoutDoc.exists()) {
          setTitle(workoutDoc.data().title);
        } else {
          alert("Workout not found!");
          navigate("/workouts");
        }
      } catch (error) {
        console.error("Error fetching workout:", error);
        alert("Failed to fetch workout.");
      }
    };
    fetchWorkout();
  }, [id, navigate]);

  // Update workout
  const handleSave = async () => {
    try {
      setLoading(true);
      const workoutRef = doc(db, "workouts", id);
      await updateDoc(workoutRef, { title }); // Update Firestore document
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
      <label>Title:</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <SaveButton onClick={handleSave} loading={loading} text="Save Changes" />
    </div>
  );
};

export default EditWorkout;
