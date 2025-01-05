import React, { useState } from "react";

const isValidInput = (exerciseId, duration, repetitions) =>
  exerciseId && (duration || repetitions);

const ExerciseSelector = ({ exercises, addExercise }) => {
  const [exerciseId, setExerciseId] = useState("");
  const [duration, setDuration] = useState("");
  const [repetitions, setRepetitions] = useState("");

  const handleAdd = () => {
    if (!isValidInput(exerciseId, duration, repetitions)) {
      alert("Select an exercise and add either duration or repetitions.");
      return;
    }
    addExercise(exerciseId, duration, repetitions);
    setExerciseId("");
    setDuration("");
    setRepetitions("");
  };

  return (
    <div>
      <h2>Add Exercises:</h2>
      <select value={exerciseId} onChange={(e) => setExerciseId(e.target.value)}>
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
      <button onClick={handleAdd}>Add Exercise</button>
    </div>
  );
};

export default ExerciseSelector;
