import { db, auth } from "@/lib/firebase";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

/**
 * Adds a career ID to the user's likedCareers array in Firestore
 */
export const saveCareer = async (careerId: number) => {
  const user = auth.currentUser;
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  try {
    await updateDoc(userRef, {
      likedCareers: arrayUnion(careerId)
    });
  } catch (error) {
    console.error("Error saving career to Firestore:", error);
  }
};

/**
 * Removes a career ID from the user's likedCareers array in Firestore
 */
export const removeCareer = async (careerId: number) => {
  const user = auth.currentUser;
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  try {
    await updateDoc(userRef, {
      likedCareers: arrayRemove(careerId)
    });
  } catch (error) {
    console.error("Error removing career from Firestore:", error);
  }
};