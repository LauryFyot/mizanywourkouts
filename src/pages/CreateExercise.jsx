import React, { useEffect } from "react";
import ExerciseCreator from "../components/ExerciseCreator";
import NavigateButton from "../components/NavigateButton";

const CreateExercise = () => {

  useEffect(() => {
    console.log("");
  }, []);

  return (
    <div>
      <h1>Create Exercise</h1>
      <ExerciseCreator/>
      <NavigateButton text="Add Exercise" to="/create-workout"/>
    </div>
  );
};

export default CreateExercise;
