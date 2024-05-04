import Header from '@/components/layout/header/Header';
import styles from './Home.module.css';

export default function HomeHeader() {
  return (
    <div className={styles.HomeHeader}>
      <div className={styles.HomeHeaderGradient} />
      <Header />
    </div>
  );
}
