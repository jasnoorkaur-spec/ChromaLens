import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, ArrowRight, Check, Download, ExternalLink, Info, ShieldCheck, TriangleAlert } from 'lucide-react';
import { profiles } from '../components/ProfileSelector.jsx';
import { PageHeading } from '../components/Status.jsx';

function sourceLabel(ai) {
  const source = String(ai?.source || '').toLowerCase();
  const status = String(ai?.status || '').toLowerCase();
  if (source.includes('gemini') || source === 'live') return { text: 'Live Gemini', tone: 'source-live' };
  if (source.includes('fallback') || status.includes('fallback') || source.includes('prepared')) return { text: 'Prepared demo fallback', tone: 'source-demo' };
  return { text: 'Local only', tone: 'source-local' };
}

function valueConfidence(value) {
  if (value === undefined || value === null) return '';
  if (typeof value === 'number') return `${Math.round(value <= 1 ? value * 100 : value)}% confidence`;
  return String(value);
}

async function downloadPng(url) {
  const response = await fetch(url, { credentials: 'include' });
  if (!response.ok) throw new Error('The transformed image could not be downloaded.');
  const sourceBlob = await response.blob();
  const objectUrl = URL.createObjectURL(sourceBlob);
  try {
    const image = await new Promise((resolve, reject) => {
      const element = new Image(); element.onload = () => resolve(element); element.onerror = () => reject(new Error('The transformed image could not be converted to PNG.')); element.src = objectUrl;
    });
    const canvas = document.createElement('canvas'); canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('PNG export is unavailable in this browser.');
    context.drawImage(image, 0, 0);
    const png = await new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('PNG export failed.')), 'image/png'));
    const link = document.createElement('a'); link.href = URL.createObjectURL(png); link.download = 'chromalens-accessible-image.png'; document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(link.href);
  } finally { URL.revokeObjectURL(objectUrl); }
}

function ImageComparison({ original, transformed, note }) {
  const [position, setPosition] = React.useState(50);
  if (!original || !transformed) return <div className="comparison-missing"><Info size={18}/><p>A before-and-after comparison is unavailable because the analysis response did not include both images.</p></div>;
  return <div className="comparison-block">
    <div className="comparison-stage">
      <img className="comparison-base" src={transformed} alt="Accessible transformed image"/>
      <div className="comparison-overlay" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}><img src={original} alt=""/></div>
      <div className="comparison-divider" style={{ left: `${position}%` }} aria-hidden="true"><span><span/></span></div>
      <span className="compare-tag compare-original">Original</span><span className="compare-tag compare-transformed">Accessible version</span>
    </div>
    <label className="slider-label" htmlFor="image-comparison">Drag or use arrow keys to compare the original with the accessible version.</label>
    <input id="image-comparison" className="comparison-slider" type="range" min="0" max="100" value={position} onChange={(event) => setPosition(Number(event.target.value))} aria-valuetext={`${position}% original image visible`}/>
    {note && <p className="muted tiny comparison-note">{note}</p>}
  </div>;
}

export default function Results() {
  const result = useSelector((state) => state.scan.result);
  const user = useSelector((state) => state.auth.user);
  const [downloadError, setDownloadError] = React.useState('');
  const [downloading, setDownloading] = React.useState(false);
  if (!result) return <div className="workspace-page"><Link to="/analysis" className="back-link"><ArrowLeft size={15}/> New analysis</Link><div className="results-empty card-surface"><span className="empty-icon"><Info size={20}/></span><div><div className="eyebrow">NO ANALYSIS YET</div><h1>Your results will appear here.</h1><p>Start with an image or one of the three in-app samples. Results only appear after the analysis service responds.</p><Link className="button button-primary" to="/analysis">Start an analysis <ArrowRight size={16}/></Link></div></div></div>;

  const aiBadge = sourceLabel(result.ai);
  const profileName = profiles.find((item) => item.id === result.profile)?.name || result.profile || 'General Accessible Mode';
  const elements = Array.isArray(result.detectedElements) ? result.detectedElements : [];
  const issues = Array.isArray(result.issues) ? result.issues : [];
  const recommendations = Array.isArray(result.recommendations) ? result.recommendations : [];
  const ocrWords = Array.isArray(result.ocr?.words) ? result.ocr.words : [];
  const ocrText = result.ocr?.text || ocrWords.map((word) => typeof word === 'string' ? word : word.text).filter(Boolean).join(' ');
  const handleDownload = async () => {
    setDownloadError(''); setDownloading(true);
    try {
      if (!result.transformedImageUrl) throw new Error('The analysis response did not include a transformed image.');
      await downloadPng(result.transformedImageUrl);
    } catch (error) { setDownloadError(error.message || 'The PNG could not be downloaded.'); }
    finally { setDownloading(false); }
  };

  return <div className="workspace-page results-page">
    <Link to="/analysis" className="back-link"><ArrowLeft size={15}/> New analysis</Link>
    <PageHeading eyebrow="ANALYSIS RESULTS" title="Here’s what the image shows." description={result.summary || 'Analysis results returned by the service.'} action={<span className="result-profile-pill"><ShieldCheck size={15}/>{profileName}</span>}/>
    <div className="result-meta"><span className={`source-badge ${aiBadge.tone}`}><span className="source-dot"/>{aiBadge.text}</span>{result.historySaved ? <span className="saved-state"><Check size={14}/> Saved to your history</span> : <span className="session-label">{user || result.signedInAtAnalysis ? 'Signed in · not saved' : 'Session only · not saved'}</span>}</div>
    <section className="result-compare-section card-surface">
      <div className="section-heading"><div><div className="eyebrow">BEFORE & AFTER</div><h2>Compare the image</h2></div>
        {result.transformedImageUrl && <button className="button button-outline" onClick={handleDownload} disabled={downloading}><Download size={16}/>{downloading ? 'Preparing PNG…' : 'Download PNG'}</button>}
      </div>
      {downloadError && <p className="form-error" role="alert">{downloadError}</p>}
      <ImageComparison original={result.originalImageUrl} transformed={result.transformedImageUrl} note={result.transformationNote}/>
    </section>
    <div className="results-columns">
      <section className="card-surface result-section">
        <div className="eyebrow">VISIBLE SIGNALS</div><h2>Detected elements</h2>
        {elements.length ? <div className="element-list">{elements.map((element, index) => <article className="element-card" key={`${element.name || 'element'}-${index}`}>
          <span className="element-swatch" style={{ '--swatch': element.color || '#83918b' }} aria-hidden="true"/>
          <div className="element-content">
            <div className="element-title-row"><h3>{element.name || `Element ${index + 1}`}</h3><code>{element.color || 'Color not reported'}</code></div>
            {element.label && <p><strong>Label:</strong> {element.label}</p>}
            {element.meaning && <p><strong>Meaning:</strong> {element.meaning}</p>}
            {(element.symbol || element.pattern) && (
              <div className="element-pattern-badge">
                {element.pattern && <span className={`element-pattern-chip pattern-${element.pattern}`}/>}
                <span>{element.symbol} {element.patternName || element.pattern || 'Pattern assigned'}</span>
              </div>
            )}
            <div className="element-confidence">{element.uncertainty ? <span className="uncertainty-tag"><Info size={12}/>{typeof element.uncertainty === 'string' ? element.uncertainty : 'Meaning uncertain'}</span> : element.confidence !== undefined && <span>{valueConfidence(element.confidence)}</span>}</div>
          </div>
        </article>)}</div> : <p className="muted">No detected elements were included in the service response.</p>}
        {Array.isArray(result.dominantColors) && result.dominantColors.length > 0 && <div className="dominant-colors"><h3>Dominant colors</h3><div className="color-chip-list">{result.dominantColors.map((color, index) => <span className="color-chip" key={`${color.hex}-${index}`}><i style={{ backgroundColor: color.hex }} aria-hidden="true"/><code>{color.hex}</code><small>{color.percentage}%</small></span>)}</div></div>}
        {Array.isArray(result.chartData) && result.chartData.length > 0 && (
          <div className="table-section">
            <div className="eyebrow">ACCESSIBLE DATA TABLE</div>
            <h3 style={{ margin: '6px 0 2px' }}>City Air Quality Data</h3>
            <p className="muted tiny" style={{ margin: '0 0 8px' }}>Companion table for non-visual and high-contrast screen reader access.</p>
            <div className="data-table-container">
              <table className="accessible-data-table">
                <thead>
                  <tr>
                    <th>City</th>
                    <th>Air-quality category</th>
                    <th>Value</th>
                    <th>Symbol</th>
                  </tr>
                </thead>
                <tbody>
                  {result.chartData.map((row, idx) => (
                    <tr key={`${row.city}-${idx}`}>
                      <td><strong>{row.city}</strong></td>
                      <td>{row.category}</td>
                      <td><code>{row.value}</code></td>
                      <td>
                        <span className="sym-badge">
                          <span className="sym-icon">{row.symbol}</span>
                          <span>{row.symbol === '▲' ? 'Warning triangle' : row.symbol === 'ℹ' ? 'Exclamation circle' : row.symbol === '✓' ? 'Checkmark' : row.symbol === '✕' ? 'Alert cross' : 'Symbol'}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
      <section className="card-surface result-section explanation-section">
        <div className="eyebrow">PLAIN-LANGUAGE EXPLANATION</div><h2>What this means</h2>
        <div className="explanation-source"><span className={`source-badge ${aiBadge.tone}`}><span className="source-dot"/>{aiBadge.text}</span></div>
        <p className="explanation-copy">{result.summary || 'The service did not provide a separate explanation.'}</p>
        {result.ai?.message && <p className="muted tiny ai-source-note">{result.ai.message}</p>}
      </section>
    </div>
    <section className="result-bottom-grid">
      <section className="card-surface result-section audit-section">
        <div className="eyebrow">ACCESSIBILITY REVIEW</div><h2>Issues to consider</h2>
        {issues.length ? <div className="issue-list">{issues.map((issue, index) => <article className="issue-row" key={`${issue.title || 'issue'}-${index}`}><span className={`issue-symbol ${String(issue.severity || '').toLowerCase()}`}><TriangleAlert size={16}/></span><div><div className="issue-heading"><h3>{issue.title || 'Accessibility issue'}</h3>{issue.severity && <span>{issue.severity}</span>}</div><p>{issue.description || 'No additional detail provided.'}</p></div></article>)}</div> : <p className="muted">No accessibility issues were reported in this response.</p>}
        {recommendations.length > 0 && <div className="recommendations"><h3>Recommendations</h3><ul>{recommendations.map((item, index) => <li key={index}><Check size={15}/><span>{item}</span></li>)}</ul></div>}
      </section>
      <section className="card-surface result-section ocr-section">
        <div className="eyebrow">TEXT RECOGNITION</div><h2>Text found in image</h2>
        {ocrText ? <><p className="ocr-copy">{ocrText}</p>{ocrWords.length > 0 && <p className="tiny muted">{ocrWords.length} text items returned</p>}</> : <p className="muted">No text was returned by the analysis service.</p>}
      </section>
    </section>
    <div className="results-footer-note"><Info size={15}/><span>Interpretations are based on information in this image; they are not medical advice. Uncertain findings should be reviewed against the source.</span></div>
  </div>;
}
