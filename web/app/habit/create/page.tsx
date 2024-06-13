import { generateMetadata } from '@/utils/generateMetadata';
import Create from './components/createContent';

export const metadata = generateMetadata({
  title: 'Create',
  description: 'Habit Builder for Happy Builders',
  images: 'icons/512x512.png',
  pathname: '',
});

export default function CreatePage() {
  return <Create />;
}
