import Claim from '../components/claim';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Claim',
  description: 'Habit Builder for Happy Builders',
};

export default function ClaimPage() {
  return <Claim />;
}
