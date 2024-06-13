import { generateMetadata } from '@/utils/generateMetadata';
import StakeContent from '../components/stakeContent';

export const metadata = generateMetadata({
  title: 'Join',
  description: 'Join a challenge to build a habit.',
  images: 'themes.png',
  pathname: '',
});

export default function StakePage() {
  return <StakeContent />;
}
