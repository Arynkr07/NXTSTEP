import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  // 1. The Link to Firebase (Critical!)
  firebaseUid: { type: String, required: true, unique: true },
  
  email: { type: String, required: true },
  name: { type: String },

  // 2. The Career Data
  careerProfile: {
    topRecommended: [String], // e.g. ["Engineer", "Artist"]
    interests: [String],
    skills: [String],
    lastQuizDate: { type: Date }
  },

  createdAt: { type: Date, default: Date.now },
});

// This line prevents "Model already compiled" errors in Next.js
export default mongoose.models.User || mongoose.model("User", UserSchema);