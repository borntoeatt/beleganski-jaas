// One delegated click handler replaces the old inline onclick="..." attributes.
// Markup uses data-action="name" (and optional data-arg="value").
import { triggerReveal, resetToScene1 } from './scenes.js';
import { showForkError, reportToHR, closeHR, easterClick, closeEaster } from './effects.js';
import { openAuth, closeAuth, signOut, resendConfirmation, deleteMessage } from './supabase.js';

const actions = {
  triggerReveal, resetToScene1,
  showForkError, reportToHR, closeHR, easterClick, closeEaster,
  openAuth, closeAuth, signOut, resendConfirmation, deleteMessage,
};

document.addEventListener('click', e => {
  const el = e.target.closest('[data-action]');
  if (!el || !actions[el.dataset.action]) return;
  if (el.tagName === 'A') e.preventDefault();
  actions[el.dataset.action](el.dataset.arg);
});

// Clicking the dark backdrop closes the auth popup
const authModal = document.getElementById('auth-modal');
authModal.addEventListener('click', e => { if (e.target === authModal) closeAuth(); });
