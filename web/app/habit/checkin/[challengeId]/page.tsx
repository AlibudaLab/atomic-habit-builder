import CheckIn from '../components/checkin';

import Header from '../../components/Header';
import { generateMetadata } from '@/utils/generateMetadata';

export const metadata = generateMetadata({
  title: 'Check In',
  description: 'Habit Builder for Happy Builders',
  images: 'themes.png',
  pathname: '',
});

export default function CheckInPage() {
  return (
    <main className="container mx-auto flex flex-col items-center px-8 pt-16">
      <Header />

      <CheckIn />
    </main>
  );
}
