import { Metadata } from 'next';
import Profile from './components/ProfileContent';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Builder Habit',
  manifest: 'public/manifest.json',
};

export default function CreatePage() {
  return <Profile />;
}
