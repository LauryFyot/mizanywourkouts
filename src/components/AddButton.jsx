import React from "react";

const AddButton = ({ onClick, loading, text = "Add" }) => {
  return (
    <button disabled={loading} onClick={onClick}>
      {loading ? "Adding..." : text}
    </button>
  );
};

export default AddButton;