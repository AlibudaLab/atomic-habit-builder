// utils.ts
import DOMPurify from 'dompurify';

const fetchSvg = async (properties: any) => {
  console.log('Fetching SVG data...');
  try {
    const response = await fetch('/api/noun', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(properties),
    });
    const { svgText } = await response.json();
    return DOMPurify.sanitize(svgText);
  } catch (error) {
    console.error('Error fetching the SVG:', error);
    throw error;
  }
};

export default fetchSvg;