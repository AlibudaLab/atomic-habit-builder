import { Metadata } from 'next';
import ProfileContent from './components/ProfileContent';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Builder Habit',
  manifest: 'public/manifest.json',
};

export default function ProfilePage() {
  return <ProfileContent />;
}
