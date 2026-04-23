import React from 'react';
import { Navbar } from '../components/landing/Navbar';
import { Contact } from '../components/landing/Contact';
import { Footer } from '../components/landing/Footer';

export const ContactPage: React.FC = () => {
  return (
    <div className="landing-wrapper">
      <Navbar />

      <main className="pt-20">
        <Contact />
      </main>

      <Footer />
    </div>
  );
};
