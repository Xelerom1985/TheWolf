import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyDqffW0BBdDdPS0C4cGAh3cvdlkQ-xSZ38",
  authDomain: "the-wolf-a94f8.firebaseapp.com",
  databaseURL: "https://the-wolf-a94f8-default-rtdb.firebaseio.com",
  projectId: "the-wolf-a94f8",
  storageBucket: "the-wolf-a94f8.firebasestorage.app",
  messagingSenderId: "350304651653",
  appId: "1:350304651653:web:fee82d1538e22660925cec",
}

const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)
