import { generateMetadata } from '@/utils/generateMetadata';
import Claim from '../components/claim';

export const metadata = generateMetadata({
  title: 'Claim',
  description: 'Habit Builder for Happy Builders',
  images: 'icons/512x512.png',
  pathname: '',
});

export default function ClaimPage() {
  return <Claim />;
}
