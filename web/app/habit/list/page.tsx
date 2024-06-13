import { generateMetadata } from '@/utils/generateMetadata';
import ChallengeList from './components/challengeList';

export const metadata = generateMetadata({
  title: 'Challenges',
  description: 'Habit Builder for Happy Builders',
  images: 'themes.png',
  pathname: '',
});

export default function ChallengeListPage() {
  return <ChallengeList />;
}
