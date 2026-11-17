import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, ArrowRight, Check, Info, LockKeyhole, Shield } from 'lucide-react';
import ImageUploader from '../components/ImageUploader.jsx';
import ProfileSelector from '../components/ProfileSelector.jsx';
import SampleGallery from '../components/SampleGallery.jsx';
import { PageHeading, RequestStatus } from '../components/Status.jsx';
import { setResult, setSelectedImageName } from '../features/store.js';
import { analyzeImage, getErrorMessage } from '../lib/api.js';
import { rasterizeSample, samples } from '../lib/samples.js';

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Could not prepare an image preview.'));
    reader.readAsDataURL(file);
  });
}

export default function Analysis() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cvdType = useSelector((state) => state.preferences.cvdType);
  const user = useSelector((state) => state.auth.user);
  const [file, setFile] = React.useState(null);
  const [previewUrl, setPreviewUrl] = React.useState('');
  const [fileError, setFileError] = React.useState('');
  const [requestState, setRequestState] = React.useState(null);
  const [busy, setBusy] = React.useState(false);
  const [saveHistory, setSaveHistory] = React.useState(false);
  const autoSampleStarted = React.useRef(false);

  const analyze = React.useCallback(async (image, originalPreview, sampleId) => {
    if (!image) return;
    setBusy(true);
    setRequestState({ kind: 'loading', title: 'Sending image for analysis', message: 'The image and selected profile are being sent to the analysis service. This may take a moment.' });
    try {
      const response = await analyzeImage({
        image,
        cvdType,
        sampleId,
        saveHistory,
        onProgress: (progress) => setRequestState((current) => current?.kind === 'loading'
          ? { ...current, message: progress.message || current.message, progress }
          : current),
      });
      if (response?.success === false || !response?.data) {
        throw new Error(response?.message || 'The analysis service did not return results. No completed analysis is available.');
      }
      const result = {
        ...response.data,
        profile: response.data.profile || cvdType,
        originalImageUrl: response.data.originalImageUrl || originalPreview,
        historySaved: Boolean(response.data.historySaved),
        signedInAtAnalysis: Boolean(user),
        sampleId: sampleId || undefined,
      };
      dispatch(setResult(result));
      dispatch(setSelectedImageName(image.name));
      setRequestState({ kind: 'success', title: 'Analysis response received', message: 'Your results are ready.' });
      navigate('/results');
    } catch (error) {
      setRequestState({ kind: 'error', title: 'Analysis unavailable', message: getErrorMessage(error, 'The analysis service could not process this image. No results were created.') });
    } finally { setBusy(false); }
  }, [cvdType, dispatch, navigate, saveHistory, user]);

  const acceptFile = React.useCallback(async (nextFile) => {
    setFile(nextFile); setFileError(''); setRequestState(null); setPreviewUrl('');
    try { setPreviewUrl(await fileToDataUrl(nextFile)); }
    catch (error) { setFile(null); setFileError(error.message); }
  }, []);

  const selectSample = React.useCallback(async (sample) => {
    if (busy) return;
    setBusy(true); setFileError(''); setRequestState({ kind: 'loading', title: `Preparing ${sample.title}`, message: 'Rendering the in-app sample as a PNG image before upload.' });
    try {
      const sampleFile = await rasterizeSample(sample);
      const dataUrl = await fileToDataUrl(sampleFile);
      setFile(sampleFile); setPreviewUrl(dataUrl); setRequestState(null);
      await analyze(sampleFile, dataUrl, sample.id);
    } catch (error) {
      setBusy(false);
      setRequestState({ kind: 'error', title: 'Sample could not be prepared', message: getErrorMessage(error, 'This sample could not be prepared as a PNG.') });
    }
  }, [analyze, busy]);

  React.useEffect(() => {
    const sample = samples.find((item) => item.id === location.state?.sampleId);
    if (sample && !autoSampleStarted.current) {
      autoSampleStarted.current = true;
      selectSample(sample);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.pathname, location.state, navigate, selectSample]);

  const removeFile = () => { setFile(null); setPreviewUrl(''); setFileError(''); setRequestState(null); dispatch(setSelectedImageName('')); };
  const submit = async (event) => {
    event.preventDefault();
    if (!file || !previewUrl) { setFileError('Choose an image first.'); return; }
    await analyze(file, previewUrl, undefined);
  };

  return <div className="workspace-page analysis-page">
    <Link to="/dashboard" className="back-link"><ArrowLeft size={15}/> Dashboard</Link>
    <PageHeading eyebrow="ACCESSIBILITY ANALYSIS" title="Make the meaning easier to see." description="Choose an image and a preferred profile. ChromaLens will send it to the analysis service and return its findings."/>
    <div className="analysis-layout">
      <form className="analysis-main card-surface" onSubmit={submit}>
        <div className="form-section-heading"><span className="step-number">01</span><div><h2>Add an image</h2><p>Choose a chart, map, form, screenshot, or photo.</p></div></div>
        <ImageUploader file={file} previewUrl={previewUrl} error={fileError} onError={setFileError} onFile={acceptFile} onRemove={removeFile}/>
        <div className="sample-inline"><div><div className="section-label">NO IMAGE HANDY?</div><p>Try a demonstration sample. It runs through the same analysis endpoint.</p></div></div>
        <SampleGallery compact onSelect={selectSample}/>
        <div className="analysis-divider"/>
        <div className="form-section-heading"><span className="step-number">02</span><div><h2>Choose a viewing profile</h2><p>Use the profile that best fits the person reading this visual.</p></div></div>
        <ProfileSelector/>
        <div className="nonmedical-note"><Info size={17}/><p>These profiles guide accessible presentation only. They do not diagnose color vision deficiency or identify a person’s vision.</p></div>
        <div className="consent-card">
          <label className="consent-label"><input type="checkbox" checked={saveHistory} onChange={(event) => setSaveHistory(event.target.checked)}/><span><strong>Save this scan to my history</strong><small>Optional. Off by default. The service will only be asked to save when you opt in.</small></span></label>
          {!user && saveHistory && <p className="consent-account-note">You are currently signed out. The service may require an account to save this scan.</p>}
          {user && <p className="consent-account-note"><LockKeyhole size={13}/> Signed in as {user.name || user.email || 'your account'}.</p>}
        </div>
        <button className="button button-primary button-large analyze-button" type="submit" disabled={busy || !file || !previewUrl}>{busy ? 'Waiting for analysis…' : <>Analyze image <ArrowRight size={17}/></>}</button>
        <p className="retention-note"><Shield size={14}/> Images are not retained by default. Saving history is optional.</p>
        <RequestStatus state={requestState}/>
      </form>
      <aside className="analysis-aside">
        <div className="aside-card">
          <div className="eyebrow">WHAT YOU’LL GET</div>
          <ol className="analysis-steps"><li><span>1</span><div><strong>Detected elements</strong><small>Colors, labels and confidence—where available.</small></div><Check size={14}/></li><li><span>2</span><div><strong>Readable explanation</strong><small>Context with its analysis source identified.</small></div><Check size={14}/></li><li><span>3</span><div><strong>Accessible version</strong><small>Compare the output and download a PNG.</small></div><Check size={14}/></li></ol>
          <p className="aside-disclaimer">Findings depend on image clarity and the information visible in your image. Uncertain meanings will be identified as uncertain.</p>
        </div>
        <div className="aside-card aside-privacy"><LockKeyhole size={17}/><div><strong>Your image stays yours</strong><p>We never pretend a client-side preview is an AI result. Findings appear only after the analysis service responds.</p></div></div>
      </aside>
    </div>
  </div>;
}
