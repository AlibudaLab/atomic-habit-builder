import { generateMetadata } from '@/utils/generateMetadata';
import Create from './components/createContent';
import Header from '../components/Header';

export const metadata = generateMetadata({
  title: 'Create',
  description: 'Habit Builder for Happy Builders',
  images: 'themes.png',
  pathname: '',
});

export default function ClaimPage() {
  return (
    <main className="container mx-auto flex h-screen flex-col items-center pt-16">
      <Header />

      <Create />
    </main>
  );
}
