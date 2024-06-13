import { Metadata } from 'next';
import ChallengeList from './components/challengeList';

export const metadata: Metadata = {
  title: 'Challenges',
  description: 'Habit Builder for Happy Builders',
};

export default function ChallengeListPage() {
  return <ChallengeList />;
}
