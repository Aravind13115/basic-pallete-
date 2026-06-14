async function postJSON(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body ?? {}),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

async function getJSON(url) {
  const res = await fetch(url);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }
  return data;
}

const qs = (s) => document.querySelector(s);

function setView(view) {
  const loginView = qs('[data-view="login"]');
  const appView = qs('[data-view="app"]');
  const err = qs('#loginError');
  if (!loginView || !appView) return;

  loginView.hidden = view !== 'login';
  appView.hidden = view !== 'app';
  if (err) err.textContent = '';
}

function showError(msg) {
  const err = qs('#loginError');
  if (err) err.textContent = msg;
}

document.addEventListener('DOMContentLoaded', async () => {
  const loginForm = qs('#loginForm');
  const emailInput = qs('#email');
  const passwordInput = qs('#password');
  const logoutBtn = qs('#logoutBtn');

  try {
    const me = await getJSON('/api/me');
    if (me?.ok && me?.user) {
      setView('app');
      return;
    }
  } catch {
    // ignore - stay on login
  }

  if (!loginForm) return;
  setView('login');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    showError('');

    const email = (emailInput.value || '').trim();
    const password = passwordInput.value || '';

    try {
      await postJSON('/api/login', { email, password });
      setView('app');
      // optional: record an action in DB
      try {
        await postJSON('/api/palette-visit', { action: 'login_ui' });
      } catch {
        // ignore
      }
    } catch (err) {
      showError(err?.message || 'Login failed');
    }
  });

  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        await fetch('/api/logout', { method: 'POST' }).catch(() => null);
      } finally {
        setView('login');
      }
    });
  }
});

