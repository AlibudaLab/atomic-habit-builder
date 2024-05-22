import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import DOMPurify from 'dompurify';

export type NounsProperty = {
  name?: string;
  alt?: string;
  height?: number;
  width?: number;
  className?: string;
};

function GenerateByName({ properties }: { properties: NounsProperty | null }) {
  const [svgData, setSvgData] = useState<string | null>(null);
  const prevProperties = useRef<NounsProperty | null>(null);

  useEffect(() => {
    if (JSON.stringify(properties) === JSON.stringify(prevProperties.current)) {
      console.log('Properties are the same, skipping fetch');
      return;
    }

    prevProperties.current = properties;

    const fetchSvg = async () => {
      console.log('Fetching SVG data...');
      try {
        const response = await fetch('/api/noun', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: properties?.name }),
        });
        const { svgText } = await response.json();
        const sanitizedSvg = DOMPurify.sanitize(svgText);
        setSvgData(sanitizedSvg);
      } catch (error) {
        console.error('Error fetching the SVG:', error);
      }
    };

    fetchSvg().catch(console.error);
  }, [properties]);

  if (!svgData) {
    return <p> </p>;
  }

  return (
    <Image
      src={`data:image/svg+xml;base64,${btoa(svgData)}`}
      height={properties?.height ? properties.height : '350'}
      width={properties?.width ? properties.width : '350'}
      alt={properties?.alt ? properties?.alt : `${properties?.name}`}
      className={properties?.className ? properties.className : 'mb-3 object-cover'}
    />
  );
}

export default GenerateByName;
