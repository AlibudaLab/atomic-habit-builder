import { ImageResponse } from '@vercel/og'

export const runtime = 'edge'

function Stat({ label, value }: { label: string, value: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <p style={{ fontSize: 24, fontWeight: 'bold', margin: 0, color: '#333333' }}>{label}</p>
      <p style={{ fontSize: 36, margin: 0, color: '#000000' }}>{value}</p>
    </div>
  )
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const type = searchParams.get('type') ?? 'unknown'
  const id = searchParams.get('id') ?? ''
  const name = searchParams.get('name') ?? ''
  const distance = parseFloat(searchParams.get('distance') ?? '0')
  const movingTime = parseInt(searchParams.get('moving_time') ?? '0', 10)
  const maxHeartrate = parseInt(searchParams.get('max_heartrate') ?? '0', 10)
  const timestamp = searchParams.get('timestamp') ?? ''

  let stats: { label: string; value: string }[] = []

  switch (type) {
    case 'run':
      stats = [
        { label: "Distance", value: `${(distance / 1000).toFixed(2)} km` },
        { label: "Time", value: formatTime(movingTime) },
        { label: "Max HR", value: `${maxHeartrate} bpm` }
      ]
      break
    case 'workout':
      stats = [
        { label: "Time", value: formatTime(movingTime) }
      ]
      break
    case 'cycling':
      stats = [
        { label: "Distance", value: `${(distance / 1000).toFixed(2)} km` },
        { label: "Time", value: formatTime(movingTime) }
      ]
      break
    default:
      stats = [{ label: "Unknown Activity", value: "No data available" }]
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: '#FFFFFF',
          fontFamily: 'Arial, sans-serif',
          color: '#000000',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '90%',
            height: '90%',
            backgroundColor: '#F8F8F8',
            borderRadius: '20px',
            padding: '20px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h1 style={{ fontSize: 48, marginBottom: 10, color: '#FC4C01' }}>{name}</h1>
          <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', marginTop: '20px' }}>
            {stats.map((stat) => (
              <Stat key={`${stat.label}-${stat.value}`} label={stat.label} value={stat.value} />
            ))}
          </div>
          <p style={{ fontSize: 24, marginTop: 30, color: '#333333' }}>Date: {formatDate(timestamp)}</p>
          <p style={{ fontSize: 18, marginTop: 10, color: '#666666' }}>Activity ID: {id}</p>
          <p style={{ fontSize: 24, marginTop: 20, color: '#FC4C01', textTransform: 'capitalize' }}>{type}</p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630
    }
  )
}