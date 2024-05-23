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

function getSingleDefinedProperty(
  properties: NounsProperty | null,
): { key: string; value: number } | null {
  if (!properties) return null;

  const specificProperties = ['background', 'body', 'accessory', 'head', 'glasses'];
  const definedProperties = specificProperties.filter(
    (prop) =>
      properties[prop as keyof NounsProperty] !== undefined &&
      properties[prop as keyof NounsProperty] !== null,
  );

  if (definedProperties.length === 1) {
    const key = definedProperties[0];
    const value = properties[key as keyof NounsProperty];
    return { key, value: value as number }; // Type assertion to ensure value is a number
  }

  return null;
}
function GetSingleTrait({ properties }: { properties: NounsProperty | null }) {
  const [svgData, setSvgData] = useState<string | null>(null);
  const prevProperties = useRef<NounsProperty | null>(null);

  useEffect(() => {
    const singleDefinedProperty = getSingleDefinedProperty(properties);
    if (!singleDefinedProperty) {
      console.log('Not exactly one property defined, skipping fetch');
      return;
    }

    if (JSON.stringify(properties) === JSON.stringify(prevProperties.current)) {
      console.log('Properties are the same, skipping fetch');
      return;
    }

    prevProperties.current = properties;

    let transformedProperties: Record<string, number | string> = {
      background: 'none',
      body: 'none',
      accessory: 'none',
      head: 'none',
      glasses: 'none',
    };

    if (singleDefinedProperty.value === -2) {
      // Remove the key and become random
      delete transformedProperties[singleDefinedProperty.key];
    } else {
      // Adjust the object based on provided properties
      transformedProperties[singleDefinedProperty.key] = singleDefinedProperty.value;
    }

    fetchSvg(transformedProperties)
    .then(sanitizedSvg => {
      if (singleDefinedProperty.key === 'glasses') {
        // Adjust the viewBox, width, and height
        setSvgData(
          sanitizedSvg
            .replace(/viewBox="[^"]+"/, 'viewBox="70 110 160 60"')
            .replace(/width="[^"]+"/, 'width="160"')
            .replace(/height="[^"]+"/, 'height="60"'),
        );
      } else {
        setSvgData(sanitizedSvg);
      }
    })
    .catch(console.error);
  }, [properties]);

  if (!svgData) {
    return <p> </p>;
  }

  return (
    <Image
      src={`data:image/svg+xml;base64,${btoa(svgData)}`}
      height={properties?.height ? properties.height : '320'}
      width={properties?.width ? properties.width : '320'}
      alt={properties?.alt ? properties?.alt : `${properties?.name}`}
      className={properties?.className ? properties.className : 'mb-2'}
    />
  );
}

export default GetSingleTrait;
