import React from "react";

const SelectedExercises = ({ selectedExercises }) => (
  <div>
    <h2>Selected Exercises:</h2>
    {selectedExercises.length === 0 ? (
      <p>No exercises added.</p>
    ) : (
      <ul>
        {selectedExercises.map((exercise, index) => (
          <li key={index}>
            {exercise.name} - {exercise.duration ? `${exercise.duration}s` : ""}{" "}
            {exercise.repetitions ? `${exercise.repetitions} reps` : ""}
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default SelectedExercises;
