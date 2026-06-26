/**
 * app.js
 * App shell: navigation wiring, hamburger menu, and shared UI utilities.
 * Import this on every protected page after calling requireAuth().
 */

import { logout }         from './auth.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { auth }           from './firebase-config.js';

/* ── Navigation ─────────────────────────────────────────────── */

/**
 * Populate the top-nav user name and wire up the logout button.
 * Called once the auth state is confirmed.
 * @param {import('firebase/auth').User} user
 */
export function initNav(user) {
  // Display name falls back to the part of the email before @
  const displayName = user.displayName || user.email.split('@')[0];
  const firstName   = displayName.split(' ')[0];

  const userNameEl = document.getElementById('nav-user-name');
  if (userNameEl) userNameEl.textContent = displayName;

  const welcomeEl = document.getElementById('welcome-name');
  if (welcomeEl) welcomeEl.textContent = firstName;

  // Logout button(s) — supports both desktop and mobile variants
  document.querySelectorAll('[data-action="logout"]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      btn.disabled = true;
      await logout();
    });
  });

  // Highlight the active nav link based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
  document.querySelectorAll('.topnav__link[data-page]').forEach((link) => {
    if (link.dataset.page === currentPage) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

/* ── Hamburger Menu ─────────────────────────────────────────── */

export function initHamburger() {
  const hamburger  = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('nav-mobile-menu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('is-open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  // Close menu when a link inside it is clicked
  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ── Shared Toast / Notification (future use) ───────────────── */

/**
 * Show a transient toast message at the bottom of the screen.
 * @param {string} message
 * @param {'success'|'error'|'info'} type
 * @param {number} duration  ms before auto-dismiss
 */
export function showToast(message, type = 'info', duration = 3500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    Object.assign(container.style, {
      position: 'fixed', bottom: '24px', right: '24px',
      display: 'flex', flexDirection: 'column', gap: '8px',
      zIndex: '9999',
    });
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `alert alert-${type === 'error' ? 'error' : 'success'}`;
  Object.assign(toast.style, {
    minWidth: '260px', maxWidth: '380px',
    boxShadow: 'var(--shadow-md)',
    animation: 'fadeInUp 0.25s ease',
  });
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => toast.remove(), duration);
}

/* ── Page Loader ────────────────────────────────────────────── */

export function showPageLoader() {
  document.body.style.opacity = '0';
}
export function hidePageLoader() {
  document.body.style.transition = 'opacity 0.2s ease';
  document.body.style.opacity = '1';
}
