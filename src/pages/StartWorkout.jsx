import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getWorkoutDetails } from '../services/workoutService';

const StartWorkout = () => {
  const { id } = useParams();
  const [workout, setWorkout] = useState(null);

  useEffect(() => {
    const fetchWorkout = async () => {
      const data = await getWorkoutDetails(id);
      setWorkout(data);
    };
    fetchWorkout();
  }, [id]);

  return (
    <div>
      <h1>{workout?.title}</h1>
      {workout?.exercises.map((exercise, index) => (
        <div key={index}>
          <p>{exercise.name} - {exercise.repetitions} or {exercise.duration}</p>
          {/* <Timer duration={exercise.duration} /> */}
        </div>
      ))}
    </div>
  );
};

export default StartWorkout;
