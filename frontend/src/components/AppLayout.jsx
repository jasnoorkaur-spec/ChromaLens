import React from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LogIn, LogOut, Menu, X } from 'lucide-react';
import { setUser } from '../features/store.js';
import { getErrorMessage, login, logout, register } from '../lib/api.js';

export function BrandMark({ compact = false }) {
  return <Link to="/" className="brand" aria-label="ChromaLens home">
    <svg className="brand-mark" viewBox="0 0 44 44" role="img" aria-hidden="true">
      <path d="M4 22C8.4 11.2 15.1 6 22 6s13.6 5.2 18 16c-4.4 10.8-11.1 16-18 16S8.4 32.8 4 22Z" fill="none" stroke="currentColor" strokeWidth="2.5"/>
      <path d="M22 7v30" stroke="currentColor" strokeWidth="2" strokeDasharray="2.5 3"/>
      <path d="M8.2 22c3.4-7.1 8-10.4 13.8-10.4v20.8C16.2 32.4 11.6 29.1 8.2 22Z" fill="currentColor" opacity=".17"/>
      <circle cx="13.5" cy="22" r="3.1" fill="currentColor"/>
      <circle cx="30.5" cy="22" r="3.1" fill="#e58b47"/>
    </svg>
    {!compact && <span className="brand-name">Chroma<span>Lens</span></span>}
  </Link>;
}

function AuthDialog({ mode, onClose }) {
  const dispatch = useDispatch();
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState('');
  const [notice, setNotice] = React.useState('');
  const [values, setValues] = React.useState({ name: '', email: '', password: '' });
  const dialogRef = React.useRef(null);
  const registerMode = mode === 'register';
  React.useEffect(() => {
    dialogRef.current?.querySelector('input')?.focus();
    const onKey = (event) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  const submit = async (event) => {
    event.preventDefault(); setError(''); setNotice('');
    if (registerMode && values.name.trim().length < 2) return setError('Enter your name (at least 2 characters).');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) return setError('Enter a valid email address.');
    if (values.password.length < 12) return setError('Password must be at least 12 characters.');
    setBusy(true);
    try {
      const payload = registerMode
        ? await register({ name: values.name.trim(), email: values.email.trim(), password: values.password })
        : await login({ email: values.email.trim(), password: values.password });
      const user = payload?.data?.user || payload?.user || null;
      if (!user) throw new Error(payload?.message || 'The service did not confirm an account session. You remain signed out.');
      dispatch(setUser(user));
      setNotice(registerMode ? 'Account created and signed in.' : 'You are signed in.');
      window.setTimeout(onClose, 600);
    } catch (requestError) { setError(getErrorMessage(requestError, 'Unable to verify your account.')); }
    finally { setBusy(false); }
  };
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section ref={dialogRef} className="auth-dialog" role="dialog" aria-modal="true" aria-labelledby="auth-title" onKeyDown={(event) => {
      if (event.key !== 'Tab') return;
      const focusable = [...event.currentTarget.querySelectorAll('button:not(:disabled),input:not(:disabled)')];
      if (!focusable.length) return;
      const first = focusable[0]; const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }}>
      <button className="icon-button dialog-close" aria-label="Close account dialog" onClick={onClose}><X size={19}/></button>
      <div className="eyebrow">YOUR CHROMALENS ACCOUNT</div>
      <h2 id="auth-title">{registerMode ? 'Create your account' : 'Welcome back'}</h2>
      <p className="muted">Demo analysis is always available without an account.</p>
      <form onSubmit={submit} className="form-stack">
        {registerMode && <label className="field-label">Name<input autoComplete="name" required minLength="2" value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })}/></label>}
        <label className="field-label">Email<input autoComplete="email" type="email" required value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })}/></label>
        <label className="field-label">Password<input autoComplete={registerMode ? 'new-password' : 'current-password'} type="password" required minLength="12" value={values.password} onChange={(e) => setValues({ ...values, password: e.target.value })}/></label>
        {error && <p className="form-error" role="alert">{error}</p>}{notice && <p className="form-success" role="status">{notice}</p>}
        <button className="button button-primary full-width" disabled={busy}>{busy ? 'Please wait…' : registerMode ? 'Create account' : 'Log in'}</button>
      </form>
      <button className="text-button modal-switch" onClick={() => window.dispatchEvent(new CustomEvent('chromalens-auth-mode', { detail: registerMode ? 'login' : 'register' }))}>
        {registerMode ? 'Already have an account? Log in' : 'New to ChromaLens? Create an account'}
      </button>
      <p className="tiny muted">Your account session is only shown after the service confirms it.</p>
    </section>
  </div>;
}

export default function AppLayout() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const [authMode, setAuthMode] = React.useState('');
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [logoutError, setLogoutError] = React.useState('');
  React.useEffect(() => {
    const listener = (event) => setAuthMode(event.detail);
    window.addEventListener('chromalens-auth-mode', listener);
    return () => window.removeEventListener('chromalens-auth-mode', listener);
  }, []);
  React.useEffect(() => { setMobileOpen(false); }, [location.pathname]);
  const doLogout = async () => {
    setLogoutError('');
    try { await logout(); dispatch(setUser(null)); }
    catch (error) { setLogoutError(getErrorMessage(error, 'Could not end the account session.')); }
  };
  const isHome = location.pathname === '/';
  return <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className={`site-header ${isHome ? 'home-header' : 'workspace-header'}`}>
      <div className="header-inner">
        <BrandMark />
        <div className="header-actions">
          {isHome ? <>
            <button className="header-login" onClick={() => setAuthMode('login')}><LogIn size={16}/> Log in</button>
            <button className="button button-primary header-create" onClick={() => setAuthMode('register')}>Create account</button>
            <Link className="button button-quiet header-demo" to="/dashboard">Try demo <span aria-hidden="true">↗</span></Link>
          </> : <>
            <nav className={`workspace-nav ${mobileOpen ? 'is-open' : ''}`} aria-label="Workspace">
              <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Dashboard</NavLink>
              <NavLink to="/analysis" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>New analysis</NavLink>
            </nav>
            {user ? <div className="account-actions"><span className="account-name" title={user.name || user.email}>{user.name || user.email || 'Signed in'}</span><button className="header-login" onClick={doLogout}><LogOut size={16}/> Log out</button></div>
              : <button className="button button-quiet" onClick={() => setAuthMode('login')}>Log in</button>}
            <button className="icon-button mobile-menu" aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X/> : <Menu/>}</button>
          </>}
        </div>
      </div>
      {logoutError && <p className="header-error" role="alert">{logoutError}</p>}
    </header>
    <main id="main-content"><Outlet /></main>
    {authMode && <AuthDialog mode={authMode} onClose={() => setAuthMode('')} />}
  </>;
}
