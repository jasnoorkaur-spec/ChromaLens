import { sampleFixtures } from './sampleFixtures.js';

export function createLocalAudit({ sampleId, colors = [] } = {}) {
  if (sampleId && sampleFixtures[sampleId]) {
    const fixture = sampleFixtures[sampleId];
    return { issues: fixture.issues, recommendations: fixture.recommendations };
  }
  return {
    issues: [{
      severity: 'info',
      title: 'Image meaning is not verified locally',
      description: 'Pixel analysis can identify colors but cannot establish their meaning without labels, a legend, or reliable contextual interpretation.',
    }, ...(colors.length > 0 ? [{
      severity: 'moderate',
      title: 'Color distinctions may not be sufficient alone',
      description: 'The image contains multiple prominent colors; check that categories also use labels, symbols, patterns, or outlines.',
    }] : [])],
    recommendations: [
      'Pair every important color with a written label or symbol.',
      'Use patterns, borders, or direct text labels as redundant cues.',
      'Review the source context before assigning meaning to any detected color.',
    ],
  };
}

export function sanitizeIssues(issues) {
  if (!Array.isArray(issues)) return [];
  const allowed = new Set(['critical', 'high', 'moderate', 'low', 'info']);
  return issues.slice(0, 12).map((issue) => ({
    severity: allowed.has(String(issue?.severity).toLowerCase()) ? String(issue.severity).toLowerCase() : 'info',
    title: String(issue?.title || 'Accessibility observation').slice(0, 180),
    description: String(issue?.description || 'No further details were provided.').slice(0, 800),
  }));
}
