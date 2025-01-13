import React from "react";

const WorkoutSelector = ({ workouts, onSelectWorkout }) => {
  return (
    <div style={{ maxHeight: "300px", overflowY: "auto", border: "1px solid #ddd", padding: "10px" }}>
      <h2>Select a Workout</h2>
      {workouts.map((workout) => (
        <button
          key={workout.id}
          onClick={() => onSelectWorkout(workout)}
          style={{
            display: "block",
            width: "100%",
            padding: "10px",
            margin: "5px 0",
            border: "1px solid #ddd",
            borderRadius: "5px",
            backgroundColor: "#f9f9f9",
            textAlign: "left",
          }}
        >
          {workout.title}
        </button>
      ))}
    </div>
  );
};

export default WorkoutSelector;
