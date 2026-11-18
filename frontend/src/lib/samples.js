import aqiOriginalImg from '../assets/samples/aqi-original.png';

const shell = (inner, label) => `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800" role="img" aria-label="${label}"><rect width="1200" height="800" fill="#fff"/>${inner}</svg>`;

export const samples = [
  {
    id: 'bar-chart',
    title: 'AQI Levels in Four Cities',
    category: 'Bar chart',
    description: 'AQI levels across City A, City B, City C, and City D with a color-coded category scale.',
    previewUrl: aqiOriginalImg,
  },
  {
    id: 'risk-map',
    title: 'Illustrative regional service risk',
    category: 'Risk map',
    description: 'A regional map uses color-coded risk levels (Low, Moderate, High) and a text legend.',
    svg: shell(
      `<text x="80" y="75" font-family="Arial, sans-serif" font-size="31" fill="#202A2E" font-weight="700">Illustrative regional service risk</text>` +
      `<text x="80" y="112" font-family="Arial, sans-serif" font-size="18" fill="#59636A" font-weight="500">Fictional service areas — not real geography</text>` +
      `<path d="M200,188 l62,-15 35,34 -12,50 -74,9 -22,-42z" fill="#C9514B" stroke="#fff" stroke-width="5"/><text x="207" y="239" font-family="Arial, sans-serif" font-size="17" fill="#172126" font-weight="700">West</text>` +
      `<path d="M400,145 l70,-8 24,48 -20,44 -66,-4 -16,-40z" fill="#E9B64D" stroke="#fff" stroke-width="5"/><text x="412" y="199" font-family="Arial, sans-serif" font-size="17" fill="#172126" font-weight="700">North</text>` +
      `<path d="M410,323 l62,-15 35,34 -12,50 -74,9 -22,-42z" fill="#4D9B78" stroke="#fff" stroke-width="5"/><text x="417" y="374" font-family="Arial, sans-serif" font-size="17" fill="#172126" font-weight="700">Central</text>` +
      `<path d="M615,235 l70,-8 24,48 -20,44 -66,-4 -16,-40z" fill="#C9514B" stroke="#fff" stroke-width="5"/><text x="627" y="289" font-family="Arial, sans-serif" font-size="17" fill="#172126" font-weight="700">East</text>` +
      `<path d="M245,398 l62,-15 35,34 -12,50 -74,9 -22,-42z" fill="#4D9B78" stroke="#fff" stroke-width="5"/><text x="252" y="449" font-family="Arial, sans-serif" font-size="17" fill="#172126" font-weight="700">Southwest</text>` +
      `<path d="M580,410 l70,-8 24,48 -20,44 -66,-4 -16,-40z" fill="#E9B64D" stroke="#fff" stroke-width="5"/><text x="592" y="464" font-family="Arial, sans-serif" font-size="17" fill="#172126" font-weight="700">Southeast</text>` +
      `<rect x="865" y="190" width="260" height="270" rx="8" fill="#F7F8F8" stroke="#C9D0D2"/>` +
      `<text x="895" y="235" font-family="Arial, sans-serif" font-size="23" fill="#202A2E" font-weight="700">Risk legend</text>` +
      `<rect x="900" y="265" width="28" height="28" fill="#4D9B78" stroke="#344"/><text x="948" y="287" font-family="Arial, sans-serif" font-size="19" fill="#202A2E" font-weight="500">Low</text>` +
      `<rect x="900" y="315" width="28" height="28" fill="#E9B64D" stroke="#344"/><text x="948" y="337" font-family="Arial, sans-serif" font-size="19" fill="#202A2E" font-weight="500">Moderate</text>` +
      `<rect x="900" y="365" width="28" height="28" fill="#C9514B" stroke="#344"/><text x="948" y="387" font-family="Arial, sans-serif" font-size="19" fill="#202A2E" font-weight="500">High</text>` +
      `<text x="80" y="700" font-family="Arial, sans-serif" font-size="17" fill="#59636A" font-weight="500">Prepared fictional example • each region has a written name</text>`,
      'Illustrative regional service risk color-coded map',
    ),
  },
  {
    id: 'status-form',
    title: 'Account settings — form status example',
    category: 'Status form',
    description: 'An account form shows completed, error, and saved states with colored accents and icons.',
    svg: shell(
      `<text x="90" y="78" font-family="Arial, sans-serif" font-size="32" fill="#202A2E" font-weight="700">Account settings — form status example</text>` +
      `<text x="100" y="160" font-family="Arial, sans-serif" font-size="20" fill="#343F45" font-weight="600">Email address</text>` +
      `<rect x="100" y="178" width="730" height="62" rx="5" fill="#fff" stroke="#3D966C" stroke-width="3"/>` +
      `<text x="125" y="218" font-family="Arial, sans-serif" font-size="21" fill="#202A2E" font-weight="500">alex@example.test</text>` +
      `<circle cx="900" cy="208" r="19" fill="#3D966C"/><text x="892" y="216" font-family="Arial, sans-serif" font-size="22" fill="#fff" font-weight="700">✓</text>` +
      `<text x="935" y="216" font-family="Arial, sans-serif" font-size="20" fill="#28754F" font-weight="700">Complete</text>` +
      `<text x="100" y="310" font-family="Arial, sans-serif" font-size="20" fill="#343F45" font-weight="600">Phone number</text>` +
      `<rect x="100" y="328" width="730" height="62" rx="5" fill="#fff" stroke="#C84D4D" stroke-width="3"/>` +
      `<circle cx="900" cy="358" r="19" fill="#C84D4D"/><text x="894" y="366" font-family="Arial, sans-serif" font-size="23" fill="#fff" font-weight="700">!</text>` +
      `<text x="935" y="366" font-family="Arial, sans-serif" font-size="20" fill="#A33A3A" font-weight="700">Error</text>` +
      `<text x="100" y="425" font-family="Arial, sans-serif" font-size="18" fill="#A33A3A" font-weight="600">Enter a valid phone number.</text>` +
      `<rect x="100" y="520" width="215" height="58" rx="6" fill="#285F89"/>` +
      `<text x="150" y="557" font-family="Arial, sans-serif" font-size="19" fill="#fff" font-weight="700">Save changes</text>` +
      `<circle cx="385" cy="550" r="17" fill="#2F6EA8"/><text x="378" y="557" font-family="Arial, sans-serif" font-size="19" fill="#fff" font-weight="700">✓</text>` +
      `<text x="415" y="558" font-family="Arial, sans-serif" font-size="19" fill="#285F89" font-weight="700">Changes saved</text>` +
      `<text x="100" y="700" font-family="Arial, sans-serif" font-size="17" fill="#59636A" font-weight="500">Each state uses an icon and written label in addition to color.</text>`,
      'Account settings form status example with complete, error, and saved states',
    ),
  },
];

export async function rasterizeSample(sample) {
  if (sample.previewUrl) {
    const response = await fetch(sample.previewUrl);
    if (!response.ok) throw new Error('Could not prepare this sample image.');
    const blob = await response.blob();
    return new File([blob], `${sample.id}.png`, { type: blob.type || 'image/png', lastModified: Date.now() });
  }
  return new Promise((resolve, reject) => {
    const svgBlob = new Blob([sample.svg], { type: 'image/svg+xml;charset=utf-8' });
    const objectUrl = URL.createObjectURL(svgBlob);
    const image = new Image();
    image.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 1200;
        canvas.height = 800;
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Canvas is unavailable in this browser.');
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(objectUrl);
        canvas.toBlob((blob) => {
          if (!blob) return reject(new Error('Could not prepare this sample image.'));
          resolve(new File([blob], `${sample.id}.png`, { type: 'image/png', lastModified: Date.now() }));
        }, 'image/png');
      } catch (error) {
        URL.revokeObjectURL(objectUrl);
        reject(error);
      }
    };
    image.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error('Could not prepare this sample image.')); };
    image.src = objectUrl;
  });
}
