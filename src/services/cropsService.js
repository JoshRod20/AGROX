import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../services/database';

export const getUserCrops = async () => {
  const userId = auth.currentUser?.uid;
  if (!userId) return [];
  const cropsRef = collection(db, 'Crops');
  const q = query(cropsRef, where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
