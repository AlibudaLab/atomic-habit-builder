import { generateMetadata } from '@/utils/generateMetadata';
import StakeContent from '../components/stakeContent';

export const metadata = generateMetadata({
  title: 'Join',
  description: 'Habit Builder for Happy Builders',
  images: 'themes.png',
  pathname: '',
});

export default function ChallengeListPage() {
  return <StakeContent />;
}
