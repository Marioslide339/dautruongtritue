import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp } from "firebase/firestore";
import type { LeaderboardEntry, Question } from "./questions";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Only initialize if config is provided
const isConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

export const app = isConfigured ? initializeApp(firebaseConfig) : null;
export const db = isConfigured ? getFirestore(app!) : null;

// Helper functions for leaderboard
export async function getGlobalLeaderboard(): Promise<LeaderboardEntry[]> {
  if (!db) return [];
  
  try {
    const q = query(
      collection(db, "leaderboard"),
      orderBy("score", "desc"),
      orderBy("timeSpent", "asc"),
      limit(50)
    );
    
    const querySnapshot = await getDocs(q);
    const entries: LeaderboardEntry[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      entries.push({
        id: doc.id,
        fullName: data.fullName,
        className: data.className,
        schoolName: data.schoolName,
        score: data.score,
        timeSpent: data.timeSpent,
        timestamp: data.timestamp?.toDate ? data.timestamp.toDate().toLocaleString("vi-VN") : data.timestamp
      });
    });
    
    return entries;
  } catch (error) {
    console.error("Error fetching global leaderboard: ", error);
    return [];
  }
}

export async function submitToGlobalLeaderboard(entry: Omit<LeaderboardEntry, 'id' | 'timestamp'>) {
  if (!db) return null;
  
  try {
    const docRef = await addDoc(collection(db, "leaderboard"), {
      ...entry,
      timestamp: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error submitting to global leaderboard: ", error);
    return null;
  }
}

export async function uploadQuestionToFirebase(question: Partial<Question>) {
  if (!db) return null;
  
  try {
    const docRef = await addDoc(collection(db, "questions"), {
      ...question,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error uploading question: ", error);
    return null;
  }
}
