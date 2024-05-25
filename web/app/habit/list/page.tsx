import { generateMetadata } from '@/utils/generateMetadata';
import ChallengeList from './components/challengeList';
import Header from '../components/Header';

export const metadata = generateMetadata({
  title: 'Challenges',
  description: 'Habit Builder for Happy Builders',
  images: 'themes.png',
  pathname: '',
});

export default function ChallengeListPage() {
  return (
    <div className="container mx-auto flex flex-col items-center px-8 pt-16">
      <Header />
      <ChallengeList />
    </div>
  );
}
