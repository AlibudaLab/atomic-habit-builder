'use client';

import useUserChallenges from '@/hooks/useUserChallenges';
import Onboard from '../habit/components/Onboard';
import Dashboard from '../habit/components/UserDashboard';
import { useAccount } from 'wagmi';
import Loading from 'app/habit/components/Loading';
import ChallengeList from 'app/habit/list/components/challengeList';
import moment from 'moment';

export default function DashboardPage() {
  const { address } = useAccount();

  const { data: challenges, loading } = useUserChallenges(address);

  const allOngoing = challenges ? challenges.filter((c) => c.endTimestamp > moment().unix()) : [];
  const allPast = challenges ? challenges.filter((c) => c.endTimestamp < moment().unix()) : [];

  return (
    <main className="container flex flex-col items-center">
      {!address ? (
        <Onboard />
      ) : loading ? (
        <Loading />
      ) : challenges.length === 0 ? (
        <ChallengeList />
      ) : (
        <Dashboard onGoingChallenges={allOngoing} pastChallenges={allPast} />
      )}
    </main>
  );
}
