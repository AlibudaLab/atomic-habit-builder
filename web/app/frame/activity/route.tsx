import { ImageResponse } from '@vercel/og';
import { robotoFontLink } from 'app/api/frame/utils/constants';
import { getFont, getMapUrl } from 'app/api/frame/utils/getter';
import { InfoBlock, TextBlock } from '../components/ActivityInfo';
import { formatActivityTime } from '@/utils/timestamp';
import { Base64 } from 'js-base64';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const [type, name, distance, movingTime, encodedPolyline] = [
    'type',
    'name',
    'distance',
    'moving_time',
    'polyline',
  ].map((param) => searchParams.get(param) ?? '');

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
          backgroundImage: `url(${getMapUrl(Base64.decode(encodedPolyline), 1200, 630)})`,
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
            <TextBlock text={name.replace(/_/g, ' ')} size="50px" />
            <TextBlock
              text={type.charAt(0).toUpperCase() + type.slice(1)}
              size="50px"
              margin="5px 0 0 0"
            />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              marginBottom: type.toLowerCase() !== 'workout' ? '20px' : '0',
            }}
          >
            <InfoBlock title="Time" value={formatActivityTime(parseInt(movingTime, 10))} />
            {type.toLowerCase() !== 'workout' && (
              <InfoBlock
                title="Distance"
                value={`${(parseFloat(distance) / 1000).toFixed(2)} km`}
              />
            )}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Roboto', data: robotoRegular, weight: 400, style: 'normal' },
        { name: 'Roboto', data: robotoBold, weight: 700, style: 'normal' },
      ],
    },
  );
}
