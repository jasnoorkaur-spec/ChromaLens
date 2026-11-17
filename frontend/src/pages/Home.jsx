import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Check, ChevronRight, Eye, ScanLine, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

function ProductPreview() {
  const rows = [
    { label: 'Q1', a: 72, b: 50 }, { label: 'Q2', a: 84, b: 59 }, { label: 'Q3', a: 94, b: 67 }, { label: 'Q4', a: 100, b: 79 },
  ];
  return <div className="preview-board" aria-label="Original chart transformed into an accessible chart">
    <div className="preview-board-header"><div><span className="live-dot"/> CHROMALENS PREVIEW</div><span>CHART · 02</span></div>
    <div className="preview-chart-pair">
      <section className="chart-panel original-panel" aria-label="Original chart: revenue shown in red and expenses in green">
        <div className="chart-title"><div><small>ORIGINAL</small><strong>Quarterly results</strong></div><span className="dots" aria-hidden="true">•••</span></div>
        <div className="mini-legend"><span><i className="legend-swatch red-swatch"/> Revenue</span><span><i className="legend-swatch green-swatch"/> Expenses</span></div>
        <div className="bar-chart original-bars">{rows.map((row) => <div className="bar-group" key={row.label}><div className="bars"><span style={{ height: `${row.a}%` }}/><span style={{ height: `${row.b}%` }}/></div><small>{row.label}</small></div>)}</div>
      </section>
      <div className="preview-arrow" aria-hidden="true"><ArrowRight size={17}/></div>
      <section className="chart-panel accessible-panel" aria-label="Accessible chart: bars include distinct patterns, labels, and strong outlines">
        <div className="chart-title"><div><small>CHROMALENS · GENERAL</small><strong>Quarterly results</strong></div><span className="accessible-mark"><Check size={12}/></span></div>
        <div className="mini-legend accessible-legend"><span><i className="legend-swatch pattern-one"/> Revenue</span><span><i className="legend-swatch pattern-two"/> Expenses</span></div>
        <div className="bar-chart accessible-bars">{rows.map((row) => <div className="bar-group" key={row.label}><div className="bars"><span style={{ height: `${row.a}%` }}><b>{row.label}</b></span><span style={{ height: `${row.b}%` }}><b>{row.label}</b></span></div><small>{row.label}</small></div>)}</div>
      </section>
    </div>
    <div className="preview-insight"><span className="insight-icon"><Eye size={15}/></span><span><strong>Labels carry the meaning.</strong> Pattern, text and color work together.</span><ArrowUpRight className="insight-arrow" size={16}/></div>
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
