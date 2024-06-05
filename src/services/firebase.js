// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxUKT-IXG8javzLNazpgOb_zvQKrIlM8Q",
  authDomain: "vue-options-api.firebaseapp.com",
  databaseURL: "https://vue-options-api-default-rtdb.firebaseio.com",
  projectId: "vue-options-api",
  storageBucket: "vue-options-api.appspot.com",
  messagingSenderId: "316858662796",
  appId: "1:316858662796:web:933710e8d879f39dda20a9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app)

export { storage }