export const sampleFixtures = {
  'bar-chart': {
    title: 'City Air Quality: Today',
    summary: 'A color-coded city air-quality bar graph compares pollution categories across Delhi, Mumbai, Chennai, and Kolkata. In the accessible transformation, each bar color is converted to a distinct textural pattern, paired with category symbols, indicator stem lines, and direct value labels.',
    detectedElements: [
      { name: 'Delhi — Poor', color: '#E07A2B', label: 'Delhi: 32 (Poor)', meaning: 'Air quality in Poor category (value 32), marked with warning triangle symbol and horizontal line pattern.', confidence: 0.98, symbol: '▲', pattern: 'stripes', patternName: 'Horizontal stripes', uncertainty: 'Pattern and symbol mapping verified.' },
      { name: 'Mumbai — Moderate', color: '#4A90E2', label: 'Mumbai: 55 (Moderate)', meaning: 'Air quality in Moderate category (value 55), marked with info circle symbol and stipple dot pattern.', confidence: 0.98, symbol: 'ℹ', pattern: 'dots', patternName: 'Stippled dots', uncertainty: 'Pattern and symbol mapping verified.' },
      { name: 'Chennai — Good', color: '#2E9358', label: 'Chennai: 78 (Good)', meaning: 'Air quality in Good category (value 78), marked with checkmark symbol and horizontal block pattern.', confidence: 0.98, symbol: '✓', pattern: 'blocks', patternName: 'Segmented blocks', uncertainty: 'Pattern and symbol mapping verified.' },
      { name: 'Kolkata — Unhealthy', color: '#8E44AD', label: 'Kolkata: 18 (Unhealthy)', meaning: 'Air quality in Unhealthy category (value 18), marked with alert cross symbol and crosshatch XXXX pattern.', confidence: 0.98, symbol: '✕', pattern: 'crosses', patternName: 'Crosshatch (XXXX)', uncertainty: 'Pattern and symbol mapping verified.' },
    ],
    issues: [
      { severity: 'high', title: 'Color-dependent bar graph', description: 'Orange, blue, green, and purple hues carry the health category without text or pattern redundancy, making categories indistinguishable for viewers with color vision deficiency.' },
      { severity: 'moderate', title: 'Missing direct value callouts', description: 'Viewers must estimate bar heights against distant axes without direct numeric values.' },
    ],
    recommendations: [
      'Convert bar fills into distinct textural patterns (horizontal lines, dense dots, segmented blocks, crosshatch XXXX).',
      'Add redundant symbols (▲ Warning, ℹ Info, ✓ Good, ✕ Alert) with vertical indicator stem lines above bars.',
      'Display numeric values directly adjacent to each bar.',
      'Include a summary data table for screen readers and keyboard users.',
    ],
    chartData: [
      { city: 'Delhi', category: 'POOR', value: 32, symbol: '▲', pattern: 'stripes', color: '#E07A2B' },
      { city: 'Mumbai', category: 'MODERATE', value: 55, symbol: 'ℹ', pattern: 'dots', color: '#4A90E2' },
      { city: 'Chennai', category: 'GOOD', value: 78, symbol: '✓', pattern: 'blocks', color: '#2E9358' },
      { city: 'Kolkata', category: 'UNHEALTHY', value: 18, symbol: '✕', pattern: 'crosses', color: '#8E44AD' },
    ],
  },
  'risk-map': {
    title: 'Illustrative regional service risk',
    summary: 'A fictional regional map labels six service areas and uses Low, Moderate, and High risk categories. The accompanying written legend defines the categories; this is an illustrative demo, not real geographic or operational data.',
    detectedElements: [
      { name: 'North region', color: '#E9B64D', label: 'North — Moderate', meaning: 'Moderate risk according to the explicit sample legend.', confidence: 0.95, uncertainty: 'Prepared illustrative sample; not a real risk assessment.' },
      { name: 'West region', color: '#C9514B', label: 'West — High', meaning: 'High risk according to the explicit sample legend.', confidence: 0.95, uncertainty: 'Prepared illustrative sample; not a real risk assessment.' },
      { name: 'South region', color: '#4D9B78', label: 'South — Low', meaning: 'Low risk according to the explicit sample legend.', confidence: 0.95, uncertainty: 'Prepared illustrative sample; not a real risk assessment.' },
    ],
    issues: [
      { severity: 'moderate', title: 'Map regions use a color scale', description: 'Region patterns and written category labels should remain available alongside fill colors.' },
      { severity: 'low', title: 'Geography is schematic', description: 'The sample map is a fictional diagram and does not represent real boundaries.' },
    ],
    recommendations: ['Keep the Low / Moderate / High legend adjacent to the map.', 'Repeat each region name and category in text or a table.', 'Use patterns and clear borders as redundant visual cues.'],
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
    summary: 'A mock account form shows one completed field, one validation error, and a saved-state confirmation. The symbols and written messages reinforce status rather than relying on green and red alone.',
    detectedElements: [
      { name: 'Email field', color: '#3D966C', label: 'Email — Complete', meaning: 'The written “Complete” state and check symbol indicate a completed field in this prepared UI example.', confidence: 0.96, uncertainty: 'Prepared illustrative sample.' },
      { name: 'Phone field', color: '#C84D4D', label: 'Phone — Error: enter a valid number', meaning: 'The written validation message and exclamation symbol identify an error state in this prepared UI example.', confidence: 0.96, uncertainty: 'Prepared illustrative sample.' },
      { name: 'Save status', color: '#2F6EA8', label: 'Changes saved', meaning: 'A written confirmation and check symbol indicate the example form was saved.', confidence: 0.94, uncertainty: 'Prepared illustrative sample.' },
    ],
    issues: [
      { severity: 'moderate', title: 'Status may be color-coded', description: 'Green and red accents alone are insufficient; retain the state words and symbols.' },
      { severity: 'low', title: 'Error guidance must stay adjacent', description: 'Keep corrective instructions close to the field that needs attention.' },
    ],
    recommendations: ['Pair every status color with an icon and a text label.', 'Associate the validation message programmatically with its field in the real interface.', 'Use a strong outline and adequate contrast for each state.'],
  },
};
