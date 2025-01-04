import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth } from "../firebase";

export const getWorkoutDetails = async (workoutId) => {
  const workoutRef = doc(db, 'workouts', workoutId);
  const workoutSnap = await getDoc(workoutRef);

  if (!workoutSnap.exists()) {
    throw new Error('Workout not found');
  }

  const workout = workoutSnap.data();

  // Fetch exercise names from references
  const exercises = await Promise.all(
    workout.exercises.map(async (ex) => {
      const exerciseSnap = await getDoc(ex.id);
      return { id: ex.id, name: exerciseSnap.data().name, ...ex };
    })
  );

  return { ...workout, exercises };
};

export const getAllUserWorkouts = async () => {
    try {
        // Get connected user
        const user = auth.currentUser;

        // Reference the "workouts" collection & the user
        const workoutsRef = collection(db, "workouts");
        const userRef = doc(db, "users", user.uid);
    
        // Create the query to filter by userId
        const q = query(workoutsRef, where("userId", "==", userRef));
    
        // Execute the query
        const querySnapshot = await getDocs(q);
    
        // Extract data from documents
        const workouts = querySnapshot.docs.map((doc) => ({
          id: doc.id, // Include the document ID
          ...doc.data(), // Include the document data
        }));
    
        return workouts;
      } catch (error) {
        console.error("Error fetching workouts:", error);
      }
  };