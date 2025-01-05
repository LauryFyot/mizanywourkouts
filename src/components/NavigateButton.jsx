import React from "react";
import { useNavigate } from "react-router-dom";

const NavigateButton = ({ to, text, style = {}, disabled = false }) => {
    
  const navigate = useNavigate();

  const handleClick = () => {
    if (!disabled) {
      navigate(to); // Navigate to the specified route
    }
  };

  return (
    <button onClick={handleClick} disabled={disabled}>
      {text}
    </button>
  );
};

export default NavigateButton;
