import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, ChevronRight, ScanLine } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import heroBackdrop from '../assets/hero-refraction-bg.jpg';

const easeCurve = [0.16, 1, 0.3, 1];

export default function Home() {
  const reduceMotion = useReducedMotion();

  const textContainer = {
    hidden: { opacity: reduceMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.09,
        delayChildren: reduceMotion ? 0 : 0.05,
      },
    },
  };

  const textItem = {
    hidden: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.52, ease: easeCurve },
    },
  };

  return (
    <div className="home-page">
      <section className="home-hero-band" aria-label="ChromaLens introduction">
        <div className="home-hero-backdrop" aria-hidden="true">
          <img
            src={heroBackdrop}
            alt=""
            className="home-hero-image"
            referrerPolicy="no-referrer"
          />
          <div className="home-hero-scrim" />
        </div>

        <motion.div
          className="home-hero-inner"
          variants={textContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="hero-kicker" variants={textItem}>
            Chromatic Accessibility Engine
          </motion.div>

          <motion.h1 className="hero-centered-title" variants={textItem}>
            See Beyond Colors.
            <br />
            <span>Understand Everything.</span>
          </motion.h1>

          <motion.p className="hero-centered-description" variants={textItem}>
            An intelligent accessibility layer that converts color-dependent charts, risk maps,
            and dashboards into dual-encoded visuals with patterns, symbols, and plain-language
            context everyone can read.
          </motion.p>

          <motion.div className="hero-centered-actions" variants={textItem}>
            <Link className="button button-primary button-large" to="/analysis">
              Try ChromaLens <ArrowRight size={17} />
            </Link>
            <Link className="button button-outline button-large" to="/dashboard">
              Explore Workspace <ChevronRight size={17} />
            </Link>
          </motion.div>

          <motion.div className="hero-centered-meta" variants={textItem}>
            <span><Check size={14} /> No account needed</span>
            <span className="meta-sep" aria-hidden="true">·</span>
            <span><ScanLine size={14} /> Private by default</span>
            <span className="meta-sep" aria-hidden="true">·</span>
            <span>Dual-encoded PNG export</span>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
