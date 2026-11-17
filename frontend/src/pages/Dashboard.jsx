import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowRight, Clock3, LockKeyhole, ScanLine, ShieldCheck, UploadCloud } from 'lucide-react';
import { PageHeading } from '../components/Status.jsx';
import ProfileSelector, { profiles } from '../components/ProfileSelector.jsx';
import SampleGallery from '../components/SampleGallery.jsx';
import { setRecent } from '../features/store.js';
import { fetchHistory } from '../lib/api.js';

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { recent } = useSelector((state) => state.scan);
  const { user } = useSelector((state) => state.auth);
  const profile = useSelector((state) => state.preferences.cvdType);
  const currentProfile = profiles.find((item) => item.id === profile);
  const [historyNotice, setHistoryNotice] = React.useState('');
  React.useEffect(() => {
    let active = true;
    if (user) fetchHistory().then((response) => {
      const records = response?.data?.history || response?.data?.scans || response?.history || response?.scans;
      if (active && Array.isArray(records)) dispatch(setRecent(records.map((record) => ({ ...record, historySaved: true, createdAt: record.createdAt || record.created_at }))));
    }).catch(() => { if (active) setHistoryNotice('Account history is unavailable right now. Recent session scans are still shown below.'); });
    return () => { active = false; };
  }, [dispatch, user]);
  const chooseSample = (sample) => navigate('/analysis', { state: { sampleId: sample.id } });
  return <div className="workspace-page">
    <PageHeading eyebrow="YOUR WORKSPACE" title="A clearer view starts here." description="Turn a color-coded image into information that works for more people." action={<Link className="button button-primary" to="/analysis"><ScanLine size={17}/> New analysis</Link>}/>
    <div className="dashboard-layout">
      <div className="dashboard-main">
        <section className="upload-callout card-surface">
          <div className="callout-icon"><UploadCloud size={22}/></div>
          <div><div className="section-label">START WITH AN IMAGE</div><h2>Bring your visual information.</h2><p>Charts, maps, forms, dashboards, or photographs. PNG, JPG, JPEG, and WebP up to 10 MB.</p><div className="callout-actions"><Link className="button button-primary" to="/analysis">Upload an image <ArrowRight size={16}/></Link><span>or explore a sample below</span></div></div>
        </section>
        <section className="section-block recent-block">
          <div className="section-heading"><div><div className="eyebrow">YOUR ACTIVITY</div><h2>Recent scans</h2></div><span className="session-label"><Clock3 size={14}/>{user ? 'Account + session' : 'This session only'}</span></div>
          {historyNotice && <p className="muted tiny" role="status">{historyNotice}</p>}
          {recent.length ? <div className="recent-list">{recent.map((scan, index) => <article className="recent-item" key={scan.id || `scan-${index}`}><span className="recent-symbol"><ScanLine size={18}/></span><div className="recent-copy"><strong>{scan.summary || scan.title || 'Visual accessibility scan'}</strong><small>{profiles.find((p) => p.id === scan.profile || p.id === scan.cvdType)?.name || scan.profile || scan.cvdType || 'General Accessible Mode'} <span>·</span> {scan.historySaved ? 'Saved to account history' : 'Session only'}</small></div><span className="recent-time">{scan.createdAt ? new Date(scan.createdAt).toLocaleDateString() : 'Just now'}</span></article>)}</div>
            : <div className="empty-state"><span className="empty-icon"><ScanLine size={21}/></span><div><strong>No scans yet</strong><p>Your completed scans appear here. By default, a scan remains in this browser session only.</p></div><Link className="text-button" to="/analysis">Start one <ArrowRight size={14}/></Link></div>}
        </section>
        <section className="section-block sample-section">
          <div className="section-heading"><div><div className="eyebrow">A FEW GOOD EXAMPLES</div><h2>Try a sample</h2></div><span className="tiny muted">No upload required</span></div>
          <SampleGallery compact onSelect={chooseSample}/>
        </section>
      </div>
      <aside className="dashboard-rail">
        <section className="profile-summary card-surface">
          <div className="rail-header"><span className="rail-icon"><ShieldCheck size={17}/></span><span className="eyebrow">PREFERRED PROFILE</span></div>
          <h2>{currentProfile?.name || 'General Accessible Mode'}</h2><p>{currentProfile?.description || 'Labels, patterns and contrast for all.'}</p>
          <ProfileSelector compact/>
        </section>
        <section className="privacy-card">
          <span className="privacy-icon"><LockKeyhole size={17}/></span><div><strong>Private by default</strong><p>Uploaded images are not retained by default. Choose whether to save a scan before analysis.</p></div>
        </section>
        <div className="access-note"><div className="eyebrow">A NOTE ON PROFILES</div><p>These preferences guide how information is presented. ChromaLens does not diagnose vision or determine what someone can see.</p></div>
      </aside>
    </div>
  </div>;
}
