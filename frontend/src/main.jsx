import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider, useDispatch } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { store, setAuthChecked, setUser } from './features/store.js';
import { fetchCurrentUser } from './lib/api.js';
const Home = React.lazy(() => import('./pages/Home.jsx'));
const Dashboard = React.lazy(() => import('./pages/Dashboard.jsx'));
const Analysis = React.lazy(() => import('./pages/Analysis.jsx'));
const Results = React.lazy(() => import('./pages/Results.jsx'));
import AppLayout from './components/AppLayout.jsx';
import './styles.css';

function SessionBootstrap() {
  const dispatch = useDispatch();
  React.useEffect(() => {
    let active = true;
    fetchCurrentUser().then((data) => {
      if (!active) return;
      dispatch(setUser(data?.data?.user || data?.user || null));
    }).catch(() => {
      if (active) dispatch(setAuthChecked());
    });
    return () => { active = false; };
  }, [dispatch]);
  return null;
}

function App() {
  return <Provider store={store}><BrowserRouter><SessionBootstrap /><React.Suspense fallback={<div className="route-loading" role="status" aria-live="polite">Loading ChromaLens workspace…</div>}><Routes>
    <Route element={<AppLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/analysis" element={<Analysis />} />
      <Route path="/results" element={<Results />} />
      <Route path="*" element={<Home />} />
    </Route>
  </Routes></React.Suspense></BrowserRouter></Provider>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
