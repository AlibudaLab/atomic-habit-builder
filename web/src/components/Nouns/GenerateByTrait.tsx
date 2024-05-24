import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import fetchSvg from './utils/fetchSvg';

export type NounsProperty = {
  name?: string;
  alt?: string;
  height?: number;
  width?: number;
  className?: string;
  background?: number;
  body?: number;
  accessory?: number;
  head?: number;
  glasses?: number;
};

function GenerateByTrait({ properties }: { properties: NounsProperty | null }) {
  const [svgData, setSvgData] = useState<string | null>(null);
  const prevProperties = useRef<NounsProperty | null>(null);

  useEffect(() => {
    if (JSON.stringify(properties) === JSON.stringify(prevProperties.current)) {
      console.log('Properties are the same, skipping fetch');
      return;
    }

    prevProperties.current = properties;

    const transformedProperties = properties
      ? {
          background: properties.background === -1 ? 'none' : properties.background,
          body: properties.body === -1 ? 'none' : properties.body,
          accessory: properties.accessory === -1 ? 'none' : properties.accessory,
          head: properties.head === -1 ? 'none' : properties.head,
          glasses: properties.glasses === -1 ? 'none' : properties.glasses,
        }
      : null;

    fetchSvg(transformedProperties)
      .then((sanitizedSvg) => setSvgData(sanitizedSvg))
      .catch(console.error);
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
      className={properties?.className ? properties.className : 'mb object-cover'}
    />
  );
}

export default GenerateByTrait;
