import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAykCUndoC1imlNXhqf7adr1WgmQtI_nus",
  authDomain: "todo-app-9e1c6.firebaseapp.com",
  projectId: "todo-app-9e1c6",
  storageBucket: "todo-app-9e1c6.firebasestorage.app",
  messagingSenderId: "461046385766",
  appId: "1:461046385766:web:e683210efd31ac5c0bb1a7",
  measurementId: "G-PC6PQ0FEP0"
};

const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);