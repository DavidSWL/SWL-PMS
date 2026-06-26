/**
 * firebase-config.js
 * Firebase initialization for SWL-PMS
 *
 * SETUP: Replace each placeholder below with values from:
 *   Firebase Console → Project Settings → Your apps → Firebase SDK snippet
 */

import { initializeApp }   from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth }         from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getFirestore }    from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { getStorage }      from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js';

// ── Replace these values with your Firebase project credentials ──────────────
const firebaseConfig = {
  apiKey: "AIzaSyA6XJoxNAuNX0LN21WxBLS7cMbY3LJCri0",
  authDomain: "swl-pms.firebaseapp.com",
  projectId: "swl-pms",
  storageBucket: "swl-pms.firebasestorage.app",
  messagingSenderId: "465838605580",
  appId: "1:465838605580:web:c3322da1833f219725b529"
  // measurementId: 'YOUR_MEASUREMENT_ID',  // Optional: only if Google Analytics is enabled
};
// ─────────────────────────────────────────────────────────────────────────────

const app       = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db   = getFirestore(app);
export const storage = getStorage(app);

export default app;
