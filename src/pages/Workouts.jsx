import React, { useEffect, useState } from "react";
import { getAllUserWorkouts } from "../services/workoutService";
import { Link } from "react-router-dom";

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllUserWorkouts();
      setWorkouts(data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Workouts</h1>
      <Link to="/create-workout">+ Create Workout</Link>
      <ul>
        {workouts.map((workout) => (
          <li key={workout.id}>
            <Link to={`/start-workout/${workout.id}`}>{workout.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Workouts;
