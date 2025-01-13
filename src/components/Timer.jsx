import React, { useState, useEffect, useCallback } from "react";

const Timer = ({ exercises, onExit }) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(true);

  const [overallTime, setOverallTime] = useState(0); // Tracks total workout time
  const [exerciseTime, setExerciseTime] = useState(null); // Tracks current exercise time (remaining for duration)

  const currentExercise = exercises[currentExerciseIndex]; // Get the current exercise

  // Move to the next exercise
  const handleNextExercise = useCallback(() => {
    if (currentExerciseIndex < exercises.length - 1) {
      console.log(
        `Exercise: ${currentExercise?.name} completed in ${
          currentExercise?.duration ? currentExercise.duration : exerciseTime
        } seconds`
      ); // Log time taken
      setExerciseTime(null); // Reset the exercise timer
      setCurrentExerciseIndex((prevIndex) => prevIndex + 1); // Move to the next exercise
    } else {
      alert("Workout Complete!");
      onExit(); // Exit the workout
    }
  }, [currentExercise, currentExerciseIndex, exerciseTime, exercises, onExit]);

  // Initialize the timer for each exercise
  useEffect(() => {
    if (currentExercise?.duration) {
      setExerciseTime(currentExercise.duration); // Set duration-based timer
    } else {
      setExerciseTime(null); // No countdown for repetitions
    }
  }, [currentExercise]);

  // Overall timer (incremental)
  useEffect(() => {
    if (isPaused) return;

    const overallTimer = setInterval(() => {
      setOverallTime((prev) => prev + 1); // Increment overall time
    }, 1000);

    return () => clearInterval(overallTimer);
  }, [isPaused]);

  // Exercise timer (countdown for duration-based exercises)
  useEffect(() => {
    if (!currentExercise?.duration || isPaused || exerciseTime === null) return;

    const exerciseTimer = setInterval(() => {
      setExerciseTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(exerciseTimer);
          handleNextExercise(); // Automatically move to the next exercise
          return 0;
        }
        return prevTime - 1; // Countdown
      });
    }, 1000);

    return () => clearInterval(exerciseTimer);
  }, [isPaused, exerciseTime, currentExercise?.duration, handleNextExercise]);

  // Pause/Resume toggle
  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  return (
    <div>
      <h1>Workout Timer</h1>
      <h2>Overall Time: {overallTime}s</h2> {/* Overall workout timer */}

      {currentExercise ? (
        <>
          <h3>{currentExercise.name}</h3> {/* Current exercise title */}
          {currentExercise.duration ? (
            <h4>Remaining Time: {exerciseTime}s</h4>
          ) : (
            <h4>Repetitions: {currentExercise.repetitions}</h4>
          )}
        </>
      ) : (
        <h3>No Exercise Selected</h3> /* Fallback if currentExercise is undefined */
      )}

      <div>
        <button onClick={handlePauseResume}>
          {isPaused ? "Start" : "Pause"}
        </button>
        <button onClick={handleNextExercise}>Next Exercise</button>
        <button onClick={onExit}>Exit</button>
      </div>
    </div>
  );
};

export default Timer;
