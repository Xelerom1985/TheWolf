import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyD_placeholder",
  authDomain: "the-wolf-a94f8.firebaseapp.com",
  databaseURL: "https://the-wolf-a94f8-default-rtdb.firebaseio.com",
  projectId: "the-wolf-a94f8",
  storageBucket: "the-wolf-a94f8.appspot.com",
  messagingSenderId: "placeholder",
  appId: "placeholder"
}

const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)
