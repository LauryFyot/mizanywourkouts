import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';

export const useFirestore = (collectionName) => {
  const getAll = async () => {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  };

  const addItem = async (item) => {
    return await addDoc(collection(db, collectionName), item);
  };

  const updateItem = async (id, updatedItem) => {
    const itemRef = doc(db, collectionName, id);
    await updateDoc(itemRef, updatedItem);
  };

  return { getAll, addItem, updateItem };
};
