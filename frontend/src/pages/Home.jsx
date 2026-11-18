import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Check, ChevronRight, Eye, ScanLine, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

function ProductPreview() {
  const items = [
    { city: 'Delhi', cat: 'POOR', val: 32, sym: '▲', color: '#E07A2B', patternClass: 'pattern-stripes' },
    { city: 'Mumbai', cat: 'MODERATE', val: 55, sym: 'ℹ', color: '#4A90E2', patternClass: 'pattern-dots' },
    { city: 'Chennai', cat: 'GOOD', val: 78, sym: '✓', color: '#2E9358', patternClass: 'pattern-blocks' },
    { city: 'Kolkata', cat: 'UNHEALTHY', val: 18, sym: '✕', color: '#8E44AD', patternClass: 'pattern-crosses' },
  ];
  return <div className="preview-board" aria-label="Original color-coded bar chart transformed into an accessible pattern chart">
    <div className="preview-board-header"><div><span className="live-dot"/> CHROMALENS PATTERN ENGINE</div><span>CITY AIR QUALITY · TODAY</span></div>
    <div className="preview-chart-pair">
      <section className="chart-panel original-panel" aria-label="Original chart: color-only bars without patterns">
        <div className="chart-title"><div><small>ORIGINAL</small><strong>Color only</strong></div><span className="dots" aria-hidden="true">•••</span></div>
        <div className="mini-legend">
          <span><i className="legend-swatch" style={{ background: '#E07A2B' }}/> Delhi</span>
          <span><i className="legend-swatch" style={{ background: '#4A90E2' }}/> Mumbai</span>
          <span><i className="legend-swatch" style={{ background: '#2E9358' }}/> Chennai</span>
          <span><i className="legend-swatch" style={{ background: '#8E44AD' }}/> Kolkata</span>
        </div>
        <div className="bar-chart original-bars air-bars">
          {items.map((item) => (
            <div className="bar-group" key={item.city}>
              <div className="bars"><span style={{ height: `${item.val}%`, backgroundColor: item.color }}/></div>
              <small>{item.city}</small>
            </div>
          ))}
        </div>
      </section>
      <div className="preview-arrow" aria-hidden="true"><ArrowRight size={17}/></div>
      <section className="chart-panel accessible-panel preview-dark-panel" aria-label="Accessible chart: bars include distinct patterns, stems, symbols and values">
        <div className="chart-title"><div><small>CHROMALENS · ACCESSIBLE</small><strong>Patterns &amp; symbols</strong></div><span className="accessible-mark"><Check size={12}/></span></div>
        <div className="mini-legend accessible-legend">
          <span>▲ Poor</span>
          <span>ℹ Mod</span>
          <span>✓ Good</span>
          <span>✕ Alert</span>
        </div>
        <div className="bar-chart accessible-bars air-bars dark-air-bars">
          {items.map((item) => (
            <div className="bar-group" key={item.city}>
              <div className="pattern-badge-pill"><span>{item.sym}</span> {item.cat}</div>
              <div className="pattern-stem-line"/>
              <div className="bars">
                <span className={`pattern-bar ${item.patternClass}`} style={{ height: `${item.val}%` }}>
                  <b className="val-callout">{item.val}</b>
                </span>
              </div>
              <small>{item.city}</small>
            </div>
          ))}
        </div>
      </section>
    </div>
    <div className="preview-insight"><span className="insight-icon"><Eye size={15}/></span><span><strong>Colors converted to distinct patterns:</strong> Stripes, dots, blocks, and crosshatch with symbols and stem lines ensure clarity for all viewers.</span><ArrowUpRight className="insight-arrow" size={16}/></div>
    <div className="preview-decoration decor-one"/><div className="preview-decoration decor-two"/>
  </div>;
}

export default function Home() {
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion ? false : { opacity: 0, y: 16 };
  const animate = reduceMotion ? {} : { opacity: 1, y: 0 };
  return <div className="home-page">
    <section className="hero-section">
      <motion.div className="hero-copy" initial={initial} animate={animate} transition={{ duration: .45 }}>
        <div className="eyebrow hero-eyebrow"><span className="eyebrow-rule"/> ACCESSIBILITY, REIMAGINED</div>
        <h1>See Beyond Colors.<br/><span>Understand Everything.</span></h1>
        <p className="hero-description">An intelligent accessibility layer that transforms color-dependent information into experiences everyone can understand.</p>
        <div className="hero-actions"><Link className="button button-primary button-large" to="/analysis">Try ChromaLens <ArrowRight size={17}/></Link><Link className="button button-outline button-large" to="/dashboard">Explore Demo <ChevronRight size={17}/></Link></div>
        <div className="hero-reassurance"><span><Check size={14}/> No account needed</span><span className="reassurance-separator"/><span><ScanLine size={14}/> Your scan, your choice</span></div>
        <div className="hero-index"><span>01</span><span className="hero-index-line"/><span>MADE FOR CLARITY</span></div>
      </motion.div>
      <motion.div className="hero-visual" initial={initial} animate={animate} transition={{ duration: .55, delay: reduceMotion ? 0 : .08 }}>
        <ProductPreview />
        <div className="floating-note"><div className="floating-icon"><Sparkles size={17}/></div><div><strong>Meaning beyond hue</strong><small>Every signal gets a second voice.</small></div></div>
      </motion.div>
      <div className="hero-side-note" aria-hidden="true"><span>INCLUSIVE BY DESIGN</span><i/></div>
    </section>
  </div>;
}
