import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2zAXGuQfE0jwthYPZQLv49V4-UrgwHFk",
  authDomain: "ecommerce-latam.firebaseapp.com",
  projectId: "ecommerce-latam",
  storageBucket: "ecommerce-latam.appspot.com",
  messagingSenderId: "942734483048",
  appId: "1:942734483048:web:4ec9684bac4e79dbe7e5dd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

console.log('app', app);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
