import React from "react";

const SelectedExercises = ({ selectedExercises, onRemove }) => {
  return (
    <div>
      <h2>Selected Exercises:</h2>
      {selectedExercises.length === 0 ? (
        <p>No exercises added.</p>
      ) : (
        <ul>
          {selectedExercises.map((exercise, index) => (
            <li key={index}>
              {exercise.name} -{" "}
              {exercise.duration ? `${exercise.duration}s` : ""}{" "}
              {exercise.repetitions ? `${exercise.repetitions} reps` : ""}
              {onRemove && (
                <button
                  onClick={() => onRemove(exercise.id)}
                  style={{ marginLeft: "10px", color: "red" }}
                >
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SelectedExercises;
