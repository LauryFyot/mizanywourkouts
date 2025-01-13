import React from "react";
import { NavLink } from "react-router-dom";

const NavBar = () => {
  const linkStyle = {
    margin: "0 10px",
    textDecoration: "none",
    color: "black",
  };

  const activeStyle = {
    fontWeight: "bold",
    color: "blue",
  };

  return (
    <nav
      style={{
        padding: "10px",
        borderBottom: "1px solid #ddd",
        marginBottom: "20px",
      }}
    >
      <NavLink to="/workouts">
        Workouts
      </NavLink>
      <NavLink to="/create-workout">
        Create Workout
      </NavLink>
      <NavLink to="/start-workout">
        Start Workout
      </NavLink>
    </nav>
  );
};

export default NavBar;
