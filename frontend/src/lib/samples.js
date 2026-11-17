const shell = (inner, label) => `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="620" viewBox="0 0 960 620" role="img" aria-label="${label}"><rect width="960" height="620" rx="28" fill="#fffefa"/><rect x="1" y="1" width="958" height="618" rx="27" fill="none" stroke="#d9ddd6" stroke-width="2"/>${inner}</svg>`;

export const samples = [
  {
    id: 'bar-chart', title: 'Quarterly performance', category: 'Bar chart', description: 'Revenue and expenses by quarter, with a red–green legend.',
    svg: shell(`<text x="64" y="78" font-family="Arial,sans-serif" font-size="30" font-weight="700" fill="#1f2b29">Quarterly performance</text><text x="64" y="112" font-family="Arial,sans-serif" font-size="17" fill="#66716d">Revenue and expenses · $ thousands</text><line x1="110" y1="470" x2="880" y2="470" stroke="#b6bfbb" stroke-width="2"/><line x1="110" y1="190" x2="110" y2="470" stroke="#b6bfbb" stroke-width="2"/><g font-family="Arial,sans-serif" font-size="14" fill="#66716d"><text x="67" y="474">0</text><text x="55" y="404">25</text><text x="55" y="334">50</text><text x="55" y="264">75</text><text x="48" y="194">100</text></g><g><rect x="190" y="280" width="64" height="190" rx="6" fill="#d95b54"/><rect x="263" y="330" width="64" height="140" rx="6" fill="#187b63"/><rect x="365" y="250" width="64" height="220" rx="6" fill="#d95b54"/><rect x="438" y="310" width="64" height="160" rx="6" fill="#187b63"/><rect x="540" y="218" width="64" height="252" rx="6" fill="#d95b54"/><rect x="613" y="286" width="64" height="184" rx="6" fill="#187b63"/><rect x="715" y="200" width="64" height="270" rx="6" fill="#d95b54"/><rect x="788" y="258" width="64" height="212" rx="6" fill="#187b63"/></g><g font-family="Arial,sans-serif" font-size="15" fill="#35403c"><text x="227" y="500">Q1</text><text x="402" y="500">Q2</text><text x="577" y="500">Q3</text><text x="752" y="500">Q4</text></g><rect x="675" y="128" width="18" height="18" rx="4" fill="#d95b54"/><text x="703" y="143" font-family="Arial,sans-serif" font-size="15" fill="#35403c">Revenue</text><rect x="788" y="128" width="18" height="18" rx="4" fill="#187b63"/><text x="816" y="143" font-family="Arial,sans-serif" font-size="15" fill="#35403c">Expenses</text><text x="110" y="560" font-family="Arial,sans-serif" font-size="15" fill="#66716d">Higher bars represent larger values. Quarter labels are shown on the horizontal axis.</text>`, 'Quarterly performance bar chart with revenue and expenses'),
  },
  {
    id: 'risk-map', title: 'Regional risk outlook', category: 'Risk map', description: 'A regional map uses color-coded risk levels and a text legend.',
    svg: shell(`<text x="64" y="78" font-family="Arial,sans-serif" font-size="30" font-weight="700" fill="#1f2b29">Regional risk outlook</text><text x="64" y="112" font-family="Arial,sans-serif" font-size="17" fill="#66716d">Operational incidents · current quarter</text><g stroke="#fffefa" stroke-width="6"><path d="M145 220l120-44 77 45-18 112-104 35-94-52z" fill="#e7a64c"/><path d="M265 176l124-21 69 58-30 97-104 23-77-45 18-112z" fill="#d86650"/><path d="M389 155l111 9 50 74-43 94-79-22 30-97z" fill="#4c8a7b"/><path d="M324 333l104-23 79 22 13 95-115 50-103-57z" fill="#4c8a7b"/><path d="M550 238l124-27 83 69-41 89-119-37-47-60z" fill="#e7a64c"/><path d="M510 427l115-64 91 6 14 73-106 39-101-9z" fill="#d86650"/></g><g font-family="Arial,sans-serif" font-size="14" font-weight="700" fill="#26332f"><text x="192" y="274">NORTH</text><text x="329" y="239">CENTRAL</text><text x="433" y="259">EAST</text><text x="350" y="384">SOUTH</text><text x="590" y="278">COAST</text><text x="558" y="430">ISLANDS</text></g><text x="706" y="175" font-family="Arial,sans-serif" font-size="15" font-weight="700" fill="#26332f">Risk level</text><rect x="706" y="196" width="22" height="22" rx="5" fill="#4c8a7b"/><text x="740" y="213" font-family="Arial,sans-serif" font-size="15" fill="#35403c">Low</text><rect x="706" y="232" width="22" height="22" rx="5" fill="#e7a64c"/><text x="740" y="249" font-family="Arial,sans-serif" font-size="15" fill="#35403c">Moderate</text><rect x="706" y="268" width="22" height="22" rx="5" fill="#d86650"/><text x="740" y="285" font-family="Arial,sans-serif" font-size="15" fill="#35403c">Elevated</text><text x="64" y="556" font-family="Arial,sans-serif" font-size="15" fill="#66716d">Illustrative regions for an accessibility demonstration; not a live risk assessment.</text>`, 'Regional risk outlook color-coded map'),
  },
  {
    id: 'status-form', title: 'Account setup review', category: 'Status form', description: 'A form dashboard shows success and error states with labels and icons.',
    svg: shell(`<text x="64" y="78" font-family="Arial,sans-serif" font-size="30" font-weight="700" fill="#1f2b29">Account setup review</text><text x="64" y="112" font-family="Arial,sans-serif" font-size="17" fill="#66716d">Workspace onboarding · 2 checks need attention</text><rect x="64" y="150" width="832" height="94" rx="15" fill="#f2f7f3" stroke="#6c9b7b" stroke-width="2"/><circle cx="103" cy="197" r="18" fill="#187b63"/><path d="M94 197l6 6 12-14" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><text x="139" y="190" font-family="Arial,sans-serif" font-size="19" font-weight="700" fill="#22312b">Email verified · Complete</text><text x="139" y="216" font-family="Arial,sans-serif" font-size="15" fill="#596660">Confirmation sent to alex@example.com</text><rect x="64" y="265" width="832" height="94" rx="15" fill="#fff5f2" stroke="#d28773" stroke-width="2"/><circle cx="103" cy="312" r="18" fill="#b74438"/><path d="M103 301v13m0 7v1" stroke="#fff" stroke-width="4" stroke-linecap="round"/><text x="139" y="305" font-family="Arial,sans-serif" font-size="19" font-weight="700" fill="#332b29">Password strength · Needs attention</text><text x="139" y="331" font-family="Arial,sans-serif" font-size="15" fill="#665955">Use at least 12 characters, including a number.</text><rect x="64" y="380" width="832" height="94" rx="15" fill="#fff5f2" stroke="#d28773" stroke-width="2"/><circle cx="103" cy="427" r="18" fill="#b74438"/><path d="M103 416v13m0 7v1" stroke="#fff" stroke-width="4" stroke-linecap="round"/><text x="139" y="420" font-family="Arial,sans-serif" font-size="19" font-weight="700" fill="#332b29">Recovery email · Action required</text><text x="139" y="446" font-family="Arial,sans-serif" font-size="15" fill="#665955">Enter an alternate address to complete this check.</text><text x="64" y="537" font-family="Arial,sans-serif" font-size="15" fill="#66716d">States are stated in words and paired with distinct symbols and borders.</text>`, 'Account setup form with complete and needs attention states'),
  },
];

export function rasterizeSample(sample) {
  return new Promise((resolve, reject) => {
    const svgBlob = new Blob([sample.svg], { type: 'image/svg+xml;charset=utf-8' });
    const objectUrl = URL.createObjectURL(svgBlob);
    const image = new Image();
    image.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 1440;
        canvas.height = 930;
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
