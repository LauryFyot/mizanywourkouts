import { db } from "../firebase";
import { doc, getDoc, setDoc, deleteDoc, updateDoc, collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { auth } from "../firebase";

// Get workout details from a workoutId
export const getWorkoutDetails = async (workoutId) => {

  // Get desired workout
  const workoutRef = doc(db, "workouts", workoutId);
  const workoutSnap = await getDoc(workoutRef);

  // Throw an error if the workout doesn't exist
  if (!workoutSnap.exists()) {
    throw new Error("Workout not found");
  }

  // Extract data from the document
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

// Get all workouts
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



// Get all workouts
export const addUserWorkout = async (title, selectedExercises) => {
  try {
    // Get connected user
    const user = auth.currentUser;

    // Add workout data
    await addDoc(collection(db, "workouts"), {
      title,
      exercises: selectedExercises.map((ex) => ({
        id: ex.id,
        duration: ex.duration,
        repetitions: ex.repetitions,
      })),
      userId: doc(db, "users", user.uid), // Store user-specific workouts
      createdAt: new Date(),
    });

  } catch (error) {
    console.error("Error fetching workouts:", error);
  }
};


// Delete workout by ID
export const deleteWorkoutById = async (id) => {
  const workoutDoc = doc(db, "workouts", id); // Get the workout document reference
  await deleteDoc(workoutDoc); // Delete workout from Firestore
};