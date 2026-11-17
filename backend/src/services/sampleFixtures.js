export const sampleFixtures = {
  'bar-chart': {
    title: 'Quarterly support requests by channel',
    summary: 'A grouped bar chart compares quarterly support requests across Email and Chat. The legend names both series; bar color alone should not carry the distinction.',
    detectedElements: [
      { name: 'Email series', color: '#D64B45', label: 'Email', meaning: 'Support requests received by email, as stated in the chart legend.', confidence: 0.97, uncertainty: 'Legend association is supplied with this prepared demo.' },
      { name: 'Chat series', color: '#32966C', label: 'Chat', meaning: 'Support requests received by chat, as stated in the chart legend.', confidence: 0.97, uncertainty: 'Legend association is supplied with this prepared demo.' },
    ],
    issues: [
      { severity: 'moderate', title: 'Series rely partly on hue', description: 'Red and green bars may be difficult to distinguish for some viewers if color is the only cue.' },
      { severity: 'low', title: 'Legend matching takes extra effort', description: 'Viewers must repeatedly compare each bar color with the legend.' },
    ],
    recommendations: ['Keep the series labels visible and pair them with distinct patterns or outlines.', 'Add direct values or labels where bars are short.', 'Retain the chart title and quarter labels in exported versions.'],
    chartData: [
      { q: 'Q1', email: 38, chat: 54 },
      { q: 'Q2', email: 51, chat: 63 },
      { q: 'Q3', email: 45, chat: 72 },
      { q: 'Q4', email: 66, chat: 81 },
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
