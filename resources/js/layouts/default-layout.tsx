import React, { ReactNode } from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';

interface DefaultLayoutProps {
  title?: string;
  children: ReactNode;
}

const DefaultLayout = ({ title = 'Wubet Gebeya', children }: DefaultLayoutProps): JSX.Element => {
  return (
    <div className="min-h-screen flex flex-col">
      <Head title={title} />
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default DefaultLayout;
