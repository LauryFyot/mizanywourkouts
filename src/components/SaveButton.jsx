import React from "react";

const SaveButton = ({ onClick, loading, text = "Save" }) => {
  return (
    <button disabled={loading} onClick={onClick}>
      {loading ? "Saving..." : text}
    </button>
  );
};

export default SaveButton;