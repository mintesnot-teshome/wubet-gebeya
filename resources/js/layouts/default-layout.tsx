import React, { ReactNode } from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';

interface DefaultLayoutProps {
  children: ReactNode;
  title?: string;
}

export default function DefaultLayout({ children, title = 'Wubet Gebeya' }: DefaultLayoutProps) {
  return (
    <>
      <Head title={title} />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}
