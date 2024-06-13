import CheckIn from '../components/checkin';

import { generateMetadata } from '@/utils/generateMetadata';

export const metadata = generateMetadata({
  title: 'Check In',
  description: 'Submit proof of progress for the challenge!',
  images: 'themes.png',
  pathname: '',
});

export default function CheckInPage() {
  return <CheckIn />;
}
