import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/database";

export const getCropActivities = async (cropId) => {
  const activitiesRef = collection(db, `Crops/${cropId}/activities`);
  const snapshot = await getDocs(activitiesRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
