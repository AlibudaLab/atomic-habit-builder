import { Metadata } from 'next';
import HistoryContent from './components/HistoryContent';

export const metadata: Metadata = {
  title: 'History',
  description: 'View your challenge history',
};

export default function History() {
  return <HistoryContent />;
}
