import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs, doc } from "firebase/firestore";
import SaveButton from "./SaveButton"; // Reuse SaveButton component

const ExerciseForm = ({ onExerciseCreated }) => {
  // State for exercise details
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]); // List of categories
  const [selectedCategory, setSelectedCategory] = useState(""); // Selected category
  const [loading, setLoading] = useState(false);

  // Fetch categories from Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "exercisesTypes")); // Replace 'categories' with your collection name
        const categoryList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("categoryList", categoryList);
        setCategories(categoryList);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Handle form submission
  const handleSave = async () => {
    if (!name || !selectedCategory) {
      alert("Please provide a name and select a category.");
      return;
    }

    try {
      setLoading(true);

      // Create exercise with category reference
      const categoryRef = doc(db, "exercisesTypes", selectedCategory);
      await addDoc(collection(db, "exercises"), {
        name,
        category: categoryRef, // Store category reference
      });

      alert("Exercise created successfully!");

      // Clear form fields
      setName("");
      setSelectedCategory("");

      // Callback to parent (if needed)
      if (onExerciseCreated) onExerciseCreated();

    } catch (error) {
      console.error("Error creating exercise:", error);
      alert("Failed to create exercise.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Create Exercise</h2>
      <div>
        <label>Name:</label>
        <input
          type="text"
          placeholder="Exercise Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label>Category:</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.category}
            </option>
          ))}
        </select>
      </div>

      <SaveButton onClick={handleSave} loading={loading} text="Save Exercise" />
    </div>
  );
};

export default ExerciseForm;
