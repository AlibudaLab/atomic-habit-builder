import { Metadata } from 'next';
import CheckIn from '../components/checkin';

export const metadata: Metadata = {
  title: 'Check In',
  description: 'Submit proof of progress for the challenge!',
};

export default function CheckInPage() {
  return <CheckIn />;
}
