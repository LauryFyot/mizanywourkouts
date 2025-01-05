import React, { createContext, useContext, useState } from "react";

// Create Context
const WorkoutContext = createContext();

// Provider Component
export const WorkoutProvider = ({ children }) => {
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [title, setTitle] = useState("");

  return (
    <WorkoutContext.Provider value={{ selectedExercises, setSelectedExercises, title, setTitle }}>
      {children}
    </WorkoutContext.Provider>
  );
};

// Custom Hook for easier access
export const useWorkout = () => useContext(WorkoutContext);
