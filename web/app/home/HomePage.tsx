'use client';
import Header from '@/components/layout/header/Header';
import Footer from '@/components/layout/footer/Footer';
// import HomeHeader from './_components/HomeHeader';

/**
 * Use the page component to wrap the components
 * that you want to render on the page.
 */
export default function HomePage() {
  return (
    <>
      <Header />
      <main className="container mx-auto flex flex-col px-8 py-16">
        <div className='container text-2xl'>
          Alibuda Habit Builder
        </div>
      </main>
      <Footer />
    </>
  );
}
