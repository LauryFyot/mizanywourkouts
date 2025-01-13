import { db } from "../firebase";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";

export const fetchAllExercises = async () => {
  const querySnapshot = await getDocs(collection(db, "exercises"));

  // Fetch exercises with categories
  const exerciseList = await Promise.all(
    querySnapshot.docs.map(async (exerciseDoc) => {
      // Replace ref categories by its name
      const categoryRef = exerciseDoc.data().category;

      // Fetch the category directly
      const categoryDoc = await getDoc(categoryRef);

      return {
        id: exerciseDoc.id,
        ...exerciseDoc.data(),
        category: categoryDoc.data().category, // Directly add category name
      };
    })
  );

  return exerciseList;
};

// Get exercise details from a exerciseId
export const getExerciseDetails = async (exerciseId) => {

  // Get desired exercise
  const exerciseRef = doc(db, "exercises", exerciseId);
  const exerciseSnap = await getDoc(exerciseRef);

  // Throw an error if the exercise doesn't exist
  if (!exerciseSnap.exists()) {
    throw new Error("Workout not found");
  }

  // Extract data from the document
  const exercise = exerciseSnap.data();

  // Fetch exercise names from references
  const exercises = await Promise.all(
    exercise.exercises.map(async (ex) => {
      const exerciseSnap = await getDoc(ex.id);
      return { id: ex.id, name: exerciseSnap.data().name, ...ex };
    })
  );
};