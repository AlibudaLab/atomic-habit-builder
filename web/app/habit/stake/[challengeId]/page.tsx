import { Metadata } from 'next';
import StakeContent from '../components/stakeContent';

export const metadata: Metadata = {
  title: 'Join',
  description: 'Join a challenge to build a habit.',
};

export default function StakePage() {
  return <StakeContent />;
}
