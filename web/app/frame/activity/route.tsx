import { ImageResponse } from '@vercel/og';
import polyline from '@mapbox/polyline';

export const runtime = 'edge';

// Utility functions
function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', marginBottom: 15 }}>
      <p style={{ fontSize: 18, fontWeight: 'bold', margin: 0, color: '#333333' }}>{label}</p>
      <p style={{ fontSize: 24, margin: 0, color: '#000000' }}>{value}</p>
    </div>
  );
}

function createSvgMap(encodedPolyline: string) {
  const coordinates = polyline.decode(encodedPolyline);

  // Find bounds
  const bounds = coordinates.reduce(
    (acc, [lat, lon]) => ({
      minLat: Math.min(acc.minLat, lat),
      minLon: Math.min(acc.minLon, lon),
      maxLat: Math.max(acc.maxLat, lat),
      maxLon: Math.max(acc.maxLon, lon),
    }),
    { minLat: Infinity, minLon: Infinity, maxLat: -Infinity, maxLon: -Infinity },
  );

  // Calculate scale and offset
  const width = 600;
  const height = 630;
  const padding = 20;
  const scale = Math.min(
    (width - 2 * padding) / (bounds.maxLon - bounds.minLon),
    (height - 2 * padding) / (bounds.maxLat - bounds.minLat),
  );

  // Create SVG path
  const pathData = coordinates
    .map(([lat, lon], index) => {
      const x = (lon - bounds.minLon) * scale + padding;
      const y = height - ((lat - bounds.minLat) * scale + padding);
      return `${index === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${width} ${height}`}>
      <rect width="100%" height="100%" fill="#f0f0f0" />
      <path d={pathData} fill="none" stroke="#FC4C01" strokeWidth="3" />
    </svg>
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const type = searchParams.get('type') ?? 'unknown';
  const id = searchParams.get('id') ?? '';
  const name = searchParams.get('name') ?? '';
  const distance = parseFloat(searchParams.get('distance') ?? '0');
  const movingTime = parseInt(searchParams.get('moving_time') ?? '0', 10);
  const maxHeartrate = parseInt(searchParams.get('max_heartrate') ?? '0', 10);
  const timestamp = searchParams.get('timestamp') ?? '';
  const encodedPolyline = searchParams.get('polyline') ?? '';

  let stats: { label: string; value: string }[] = [];

  switch (type) {
    case 'run':
      stats = [
        { label: 'Distance', value: `${(distance / 1000).toFixed(2)} km` },
        { label: 'Time', value: formatTime(movingTime) },
        { label: 'Max HR', value: `${maxHeartrate} bpm` },
      ];
      break;
    case 'workout':
      stats = [{ label: 'Time', value: formatTime(movingTime) }];
      break;
    case 'cycling':
      stats = [
        { label: 'Distance', value: `${(distance / 1000).toFixed(2)} km` },
        { label: 'Time', value: formatTime(movingTime) },
      ];
      break;
    default:
      stats = [{ label: 'Unknown Activity', value: 'No data available' }];
  }

  const svgMap = createSvgMap(encodedPolyline);

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          backgroundColor: '#FFFFFF',
          fontFamily: 'Arial, sans-serif',
          color: '#000000',
        }}
      >
        {/* Left column for information */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            width: '50%',
            height: '100%',
            padding: '40px',
            backgroundColor: '#F8F8F8',
          }}
        >
          <h1 style={{ fontSize: 40, marginBottom: 20, color: '#FC4C01' }}>{name}</h1>
          <p
            style={{
              fontSize: 24,
              marginBottom: 20,
              color: '#FC4C01',
              textTransform: 'capitalize',
            }}
          >
            {type}
          </p>
          {stats.map((stat) => (
            <Stat key={`${stat.label}-${stat.value}`} label={stat.label} value={stat.value} />
          ))}
          <p style={{ fontSize: 18, marginTop: 20, color: '#333333' }}>
            Date: {formatDate(timestamp)}
          </p>
          <p style={{ fontSize: 14, marginTop: 10, color: '#666666' }}>Activity ID: {id}</p>
        </div>

        {/* Right column for map */}
        <div
          style={{
            display: 'flex',
            width: '50%',
            height: '100%',
          }}
        >
          {svgMap}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
