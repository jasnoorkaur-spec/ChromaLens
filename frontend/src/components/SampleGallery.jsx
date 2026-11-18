import React from 'react';
import { ArrowUpRight, ChartNoAxesColumnIncreasing, Map, SquareCheckBig } from 'lucide-react';
import { samples } from '../lib/samples.js';

const icons = [ChartNoAxesColumnIncreasing, Map, SquareCheckBig];

export default function SampleGallery({ onSelect, compact = false }) {
  return (
    <div className={`sample-grid ${compact ? 'sample-grid-compact' : ''}`}>
      {samples.map((sample, index) => {
        const Icon = icons[index];
        return (
          <article className="sample-card" key={sample.id}>
            <div className="sample-preview" aria-hidden="true">
              <img
                src={sample.previewUrl || `data:image/svg+xml;charset=utf-8,${encodeURIComponent(sample.svg)}`}
                alt=""
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="sample-card-copy">
              <div className="sample-kind">
                <Icon size={14} />
                {sample.category}
              </div>
              <h3>{sample.title}</h3>
              <p>{sample.description}</p>
              <button
                type="button"
                className="sample-action"
                onClick={() => onSelect(sample)}
              >
                {compact ? 'Open workspace' : 'Analyze this sample'} <ArrowUpRight size={15} />
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
