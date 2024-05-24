import { generateMetadata } from '@/utils/generateMetadata';
import StakeContent from './stakeContent';

export const metadata = generateMetadata({
  title: 'Join',
  description: 'Habit Builder for Happy Builders',
  images: 'themes.png',
  pathname: '',
});

export default function ChallengeListPage() {
  return <StakeContent />;
}
