/**
 * auth.js
 * Handles login, logout, password reset, and session persistence.
 */

import { auth } from './firebase-config.js';
import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  onAuthStateChanged,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

/**
 * Sign the user in.
 * @param {string}  email
 * @param {string}  password
 * @param {boolean} rememberMe  true → persist across sessions (localStorage)
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export async function login(email, password, rememberMe = false) {
  const persistence = rememberMe
    ? browserLocalPersistence
    : browserSessionPersistence;

  await setPersistence(auth, persistence);
  return signInWithEmailAndPassword(auth, email, password);
}

/**
 * Sign the current user out and redirect to the login page.
 */
export async function logout() {
  await signOut(auth);
  window.location.href = '/index.html';
}

/**
 * Send a password-reset email.
 * @param {string} email
 */
export async function requestPasswordReset(email) {
  await sendPasswordResetEmail(auth, email);
}

/**
 * Returns a promise that resolves with the current user (or null).
 * Useful for a one-time auth check on page load.
 */
export function getCurrentUser() {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}

/**
 * Auth guard — call at the top of every protected page.
 * Redirects to index.html if not authenticated.
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    window.location.href = '/index.html';
  }
  return user;
}

/**
 * Redirect guard — call on the login page.
 * If already logged in, go straight to the dashboard.
 */
export async function redirectIfAuthenticated() {
  const user = await getCurrentUser();
  if (user) {
    window.location.href = '/dashboard.html';
  }
}

/**
 * Map Firebase Auth error codes to friendly messages.
 * @param {import('firebase/auth').AuthError} err
 * @returns {string}
 */
export function friendlyAuthError(err) {
  const map = {
    'auth/invalid-email':        'Please enter a valid email address.',
    'auth/user-not-found':       'No account found with that email address.',
    'auth/wrong-password':       'Incorrect password. Please try again.',
    'auth/invalid-credential':   'Invalid email or password.',
    'auth/too-many-requests':    'Too many failed attempts. Please try again later.',
    'auth/user-disabled':        'This account has been disabled. Contact your administrator.',
    'auth/network-request-failed':'Network error. Check your connection and try again.',
  };
  return map[err.code] || 'An unexpected error occurred. Please try again.';
}
