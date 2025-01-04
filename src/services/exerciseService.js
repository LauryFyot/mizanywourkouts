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