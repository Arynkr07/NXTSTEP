import { db, auth } from "@/lib/firebase";
import { doc, setDoc, arrayUnion, arrayRemove } from "firebase/firestore";

export const toggleFavoriteCareer = async (careerId: number, isCurrentlyLiked: boolean) => {
  const user = auth.currentUser;
  if (!user) return;

  const userRef = doc(db, "users", user.uid);

  try {
    // We use setDoc instead of updateDoc to ensure the document exists
    await setDoc(userRef, {
      likedCareers: isCurrentlyLiked 
        ? arrayRemove(careerId) 
        : arrayUnion(careerId)
    }, { merge: true }); // This merge flag is critical!

    console.log("Success!");
  } catch (error) {
    console.error("Error:", error);
  }
};