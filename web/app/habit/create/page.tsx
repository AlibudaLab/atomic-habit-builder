import { Metadata } from 'next';
import Create from './components/createContent';

export const metadata: Metadata = {
  title: 'Create',
  description: 'Habit Builder for Happy Builders',
};

export default function CreatePage() {
  return <Create />;
}
