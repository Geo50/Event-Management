// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3E3DCs-h55nZQPK2CvhKdPln7RQxDzrM",
  authDomain: "event-management-9512d.firebaseapp.com",
  projectId: "event-management-9512d",
  storageBucket: "event-management-9512d.appspot.com",
  messagingSenderId: "137853203989",
  appId: "1:137853203989:web:6c18fcb3d5d80c27e1001c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export { storage, ref, uploadBytes, getDownloadURL  };