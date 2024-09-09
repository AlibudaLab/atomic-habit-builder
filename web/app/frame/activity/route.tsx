import { ImageResponse } from '@vercel/og';
import { robotoFontLink } from 'app/api/frame/utils/constants';
import { formatTime } from 'app/api/frame/utils/format';
import { getFont, getMapUrl } from 'app/api/frame/utils/getter';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const type = searchParams.get('type') ?? 'unknown';
  const name = searchParams.get('name') ?? '';
  const distance = parseFloat(searchParams.get('distance') ?? '0');
  const movingTime = parseInt(searchParams.get('moving_time') ?? '0', 10);
  const encodedPolyline = searchParams.get('polyline') ?? '';

  const [robotoRegular, robotoBold] = await Promise.all([
    getFont(robotoFontLink.regular),
    getFont(robotoFontLink.bold),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          backgroundImage: `url(${getMapUrl(encodedPolyline, 1200, 630)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          fontFamily: 'Roboto',
          display: 'flex',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '0',
            left: '748.75',
            right: '0',
            bottom: '0',
            background: 'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%)',
          }}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '30px',
            marginLeft: 'auto',
            width: '50%',
            height: '100%',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <p
              style={{
                fontSize: '50px',
                fontWeight: 'bold',
                margin: '0',
                color: '#FFFFFF',
                textAlign: 'right',
              }}
            >
              {name}
            </p>
            <p
              style={{
                fontSize: '50px',
                fontWeight: 'bold',
                margin: '5px 0 0 0',
                color: '#FFFFFF',
                textAlign: 'right',
              }}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </p>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              marginBottom: type.toLowerCase() !== 'workout' ? '20px' : '0',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                marginBottom: '20px',
              }}
            >
              <p
                style={{
                  fontSize: '40px',
                  fontWeight: '700',
                  margin: '0 0 5px 0',
                  color: '#FFFFFF',
                }}
              >
                Time
              </p>
              <p
                style={{
                  fontSize: '40px',
                  fontWeight: '700',
                  margin: '0',
                  color: '#FFFFFF',
                }}
              >
                {formatTime(movingTime)}
              </p>
            </div>
            {type.toLowerCase() !== 'workout' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <p
                  style={{
                    fontSize: '40px',
                    fontWeight: '700',
                    margin: '0 0 5px 0',
                    color: '#FFFFFF',
                  }}
                >
                  Distance
                </p>
                <p
                  style={{
                    fontSize: '40px',
                    fontWeight: '700',
                    margin: '0',
                    color: '#FFFFFF',
                  }}
                >
                  {(distance / 1000).toFixed(2)} km
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Roboto',
          data: robotoRegular,
          weight: 400,
          style: 'normal',
        },
        {
          name: 'Roboto',
          data: robotoBold,
          weight: 700,
          style: 'normal',
        },
      ],
    },
  );
}
