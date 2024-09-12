import { Metadata } from 'next';
import SpecialWithdraw from './components/SpecialWithdraw';

export const metadata: Metadata = {
  title: 'Special Withdrawal',
  description: 'Builder Habit',
  manifest: 'public/manifest.json',
};

export default function SpecialWithraw() {
  return <SpecialWithdraw />;
}
