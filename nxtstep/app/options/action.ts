import { db, auth } from "@/lib/firebase";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

export const toggleFavoriteCareer = async (careerId: number, isCurrentlyLiked: boolean) => {
  const user = auth.currentUser;

  if (!user) {
    console.error("You must be logged in to save careers!");
    return;
  }

  // Reference to the specific user's document
  const userRef = doc(db, "users", user.uid);

  try {
    if (isCurrentlyLiked) {
      // If already liked, remove it
      await updateDoc(userRef, {
        likedCareers: arrayRemove(careerId)
      });
      console.log("Career removed from favorites");
    } else {
      // If not liked, add it
      await updateDoc(userRef, {
        likedCareers: arrayUnion(careerId)
      });
      console.log("Career added to favorites!");
    }
  } catch (error) {
    console.error("Error updating favorites:", error);
  }
};