import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth } from "../firebase";

export const getAllExercises = async () => {
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