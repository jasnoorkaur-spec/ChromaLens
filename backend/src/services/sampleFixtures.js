export const sampleFixtures = {
  'bar-chart': {
    title: 'AQI Levels in Four Cities',
    summary: 'A color-coded bar chart compares Air Quality Index (AQI) levels across City A (180 — Very Poor), City B (35 — Good), City C (350 — Severe), and City D (90 — Moderate) against the five-tier AQI Category Scale. In the accessible version, color fills are replaced with distinct navy monochrome patterns while keeping the exact same layout and values.',
    detectedElements: [
      { name: 'City A — Very Poor', color: '#E87D1E', label: 'City A: 180 (Very Poor / 151-200)', meaning: 'AQI of 180 placed in the upper range with an orange bar in the original; replaced with a navy crosshatch pattern in the accessible version.', confidence: 0.98, symbol: '▲', pattern: 'crosses', patternName: 'Crosshatch pattern', uncertainty: 'Pattern mapping matches uploaded AQI sample.' },
      { name: 'City B — Good', color: '#1B7339', label: 'City B: 35 (Good / 0-50)', meaning: 'AQI of 35 in the Good (0-50) range with a green bar in the original; replaced with fine diagonal navy lines in the accessible version.', confidence: 0.98, symbol: '✓', pattern: 'stripes', patternName: 'Fine diagonal lines', uncertainty: 'Pattern mapping matches uploaded AQI sample.' },
      { name: 'City C — Severe', color: '#6C0E0E', label: 'City C: 350 (Severe / 201+)', meaning: 'AQI of 350 in the Severe (201+) range with a dark red bar in the original; replaced with bold diagonal navy stripes in the accessible version.', confidence: 0.98, symbol: '✕', pattern: 'blocks', patternName: 'Bold diagonal stripes', uncertainty: 'Pattern mapping matches uploaded AQI sample.' },
      { name: 'City D — Moderate', color: '#EBD223', label: 'City D: 90 (Moderate / 51-100)', meaning: 'AQI of 90 in the Moderate (51-100) range with a yellow bar in the original; replaced with horizontal navy stripes in the accessible version.', confidence: 0.98, symbol: 'ℹ', pattern: 'dots', patternName: 'Horizontal stripes', uncertainty: 'Pattern mapping matches uploaded AQI sample.' },
    ],
    issues: [
      { severity: 'high', title: 'Color-dependent AQI bar chart and scale', description: 'Green, yellow, orange, red, and dark maroon hues encode AQI severity across the bars and bottom scale without pattern redundancy for viewers with color vision deficiency.' },
      { severity: 'moderate', title: 'Scale swatches rely on hue alone', description: 'Adjacent warm hues (yellow, orange, red) and dark red vs. green become difficult to separate when color discrimination is reduced.' },
    ],
    recommendations: [
      'Replace color-only bar and AQI Category Scale fills with distinct monochrome patterns (fine diagonal lines, horizontal stripes, crosshatch, stippled dots, and bold diagonal stripes).',
      'Preserve exact bar positions, numeric value labels (180, 35, 350, 90), and category ranges.',
      'Provide a structured companion data table for screen readers and keyboard navigation.',
    ],
    chartData: [
      { city: 'City A', category: 'VERY POOR', value: 180, symbol: '▲', pattern: 'crosses', color: '#E87D1E' },
      { city: 'City B', category: 'GOOD', value: 35, symbol: '✓', pattern: 'stripes', color: '#1B7339' },
      { city: 'City C', category: 'SEVERE', value: 350, symbol: '✕', pattern: 'blocks', color: '#6C0E0E' },
      { city: 'City D', category: 'MODERATE', value: 90, symbol: 'ℹ', pattern: 'dots', color: '#EBD223' },
    ],
  },
  'risk-map': {
    title: 'Illustrative regional service risk',
    summary: 'A fictional regional map labels six service areas using Low, Moderate, and High risk categories paired with a written legend. In the accessible version, the same map layout and labels are preserved while color-only region and legend fills are converted to distinct navy monochrome patterns.',
    detectedElements: [
      { name: 'North & Southeast — Moderate', color: '#E9B64D', label: 'Moderate risk', meaning: 'Moderate risk category from the legend; converted from amber fill to horizontal navy stripes.', confidence: 0.95, symbol: 'ℹ', pattern: 'stripes', patternName: 'Horizontal stripes', uncertainty: 'Prepared illustrative sample; not a real risk assessment.' },
      { name: 'West & East — High', color: '#C9514B', label: 'High risk', meaning: 'High risk category from the legend; converted from red fill to bold diagonal/crosshatch navy pattern.', confidence: 0.95, symbol: '✕', pattern: 'crosses', patternName: 'Crosshatch pattern', uncertainty: 'Prepared illustrative sample; not a real risk assessment.' },
      { name: 'Central & Southwest — Low', color: '#4D9B78', label: 'Low risk', meaning: 'Low risk category from the legend; converted from green fill to stippled dot navy pattern.', confidence: 0.95, symbol: '✓', pattern: 'dots', patternName: 'Stippled dots', uncertainty: 'Prepared illustrative sample; not a real risk assessment.' },
    ],
    issues: [
      { severity: 'moderate', title: 'Map regions rely on hue fills', description: 'Green, amber, and red region fills require pattern redundancy so categories remain distinguishable without color.' },
      { severity: 'low', title: 'Geography is schematic', description: 'The sample map is a fictional diagram and does not represent real boundaries.' },
    ],
    recommendations: [
      'Convert Low, Moderate, and High region fills and legend swatches into distinct monochrome patterns.',
      'Keep the exact region boundaries, text labels, and legend placement unchanged.',
      'Maintain high-contrast text halos around region names over patterned fills.',
    ],
    regions: [
      { name: 'West', risk: 'High', color: '#C9514B', x: 255, y: 230 },
      { name: 'North', risk: 'Moderate', color: '#E9B64D', x: 460, y: 190 },
      { name: 'Central', risk: 'Low', color: '#4D9B78', x: 465, y: 365 },
      { name: 'East', risk: 'High', color: '#C9514B', x: 675, y: 280 },
      { name: 'Southwest', risk: 'Low', color: '#4D9B78', x: 300, y: 440 },
      { name: 'Southeast', risk: 'Moderate', color: '#E9B64D', x: 640, y: 455 },
    ],
  },
  'status-form': {
    title: 'Account settings — form status example',
    summary: 'An account settings form shows one completed field, one validation error, and a saved-state confirmation. In the accessible version, the exact form layout, typography, and icons remain identical while color-coded borders, badges, and button fills are replaced with distinct navy monochrome patterns and stroke styles.',
    detectedElements: [
      { name: 'Email field', color: '#3D966C', label: 'Email — Complete', meaning: 'Completed state converted from green border/badge to fine diagonal navy pattern and solid outline.', confidence: 0.96, symbol: '✓', pattern: 'stripes', patternName: 'Fine diagonal lines', uncertainty: 'Prepared illustrative sample.' },
      { name: 'Phone field', color: '#C84D4D', label: 'Phone — Error: enter a valid number', meaning: 'Validation error state converted from red border/badge to crosshatch navy pattern and dashed outline.', confidence: 0.96, symbol: '!', pattern: 'crosses', patternName: 'Crosshatch pattern', uncertainty: 'Prepared illustrative sample.' },
      { name: 'Save status', color: '#2F6EA8', label: 'Changes saved', meaning: 'Save action and confirmation badge converted from blue fills to horizontal navy stripe pattern.', confidence: 0.94, symbol: '✓', pattern: 'blocks', patternName: 'Horizontal stripes', uncertainty: 'Prepared illustrative sample.' },
    ],
    issues: [
      { severity: 'moderate', title: 'Status accents depend on hue', description: 'Green, red, and blue borders and icon fills should be reinforced by distinct monochrome patterns and stroke styles.' },
      { severity: 'low', title: 'Error guidance must stay adjacent', description: 'Keep corrective instructions close to the field that needs attention.' },
    ],
    recommendations: [
      'Replace color-only borders, status badges, and button fills with distinct navy patterns while keeping layout identical.',
      'Pair pattern fills with distinguishable solid vs. dashed field strokes.',
      'Preserve clear icons and written status text adjacent to every control.',
    ],
  },
};

