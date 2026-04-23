import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';
import { Shield, Eye, Lock, Database, Globe, Bell } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="landing-wrapper">
      <Navbar />

      <main className="pt-24 lg:pt-32 pb-24">
        {/* Header Section */}
        <section className="max-w-4xl mx-auto px-6 text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="h-16 w-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mx-auto mb-8">
              <Shield size={32} strokeWidth={1.5} />
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
              Privacy <span className="text-accent italic">Policy</span>
            </h1>
            <p className="text-base md:text-lg text-foreground/50 max-w-xl mx-auto leading-relaxed font-medium">
              We value your privacy as much as our own. Here's how we protect your data and what we do (and don't do) with it.
            </p>
            <p className="text-sm font-bold text-foreground/20 uppercase tracking-[0.2em] mt-8">
              Last Updated: April 22, 2026
            </p>
          </motion.div>
        </section>

        {/* Content Section */}
        <section className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="space-y-12 lg:space-y-16"
          >
            {/* Section 1 */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-card border border-white/5 flex items-center justify-center text-foreground/40 mt-1">
                <Database size={20} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Data Collection</h2>
                <p className="text-foreground/50 leading-relaxed font-medium">
                  We collect only the information necessary to provide and improve NeoPlane. This includes your account details (name, email), profile settings, and the messages you send within the platform.
                </p>
              </div>
            </div>

            {/* Section 2 */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-card border border-white/5 flex items-center justify-center text-foreground/40 mt-1">
                <Lock size={20} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Encryption & Security</h2>
                <p className="text-foreground/50 leading-relaxed font-medium">
                  All communications within NeoPlane are encrypted in transit and at rest. We use industry-standard security protocols to ensure your conversations remain private and secure.
                </p>
              </div>
            </div>

            {/* Section 3 */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-card border border-white/5 flex items-center justify-center text-foreground/40 mt-1">
                <Eye size={20} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Transparency</h2>
                <p className="text-foreground/50 leading-relaxed font-medium">
                  We are transparent about who we share data with. We do not sell your personal information to third parties. Data is only shared with trusted service providers essential for operating NeoPlane (e.g., hosting, authentication).
                </p>
              </div>
            </div>

            {/* Section 4 */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-card border border-white/5 flex items-center justify-center text-foreground/40 mt-1">
                <Globe size={20} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Your Rights</h2>
                <p className="text-foreground/50 leading-relaxed font-medium">
                  You have the right to access, correct, or delete your data at any time. Our settings panel provides tools for you to manage your profile and data footprint.
                </p>
              </div>
            </div>

            {/* Section 5 */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-card border border-white/5 flex items-center justify-center text-foreground/40 mt-1">
                <Bell size={20} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Updates</h2>
                <p className="text-foreground/50 leading-relaxed font-medium">
                  We may update this policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any significant changes.
                </p>
              </div>
            </div>

            {/* Contact Footer */}
            <div className="pt-12 border-t border-white/5 text-center">
              <p className="text-foreground/40 text-sm font-medium">
                Questions about our privacy practices? <a href="/contact" className="text-accent hover:underline font-bold">Contact us</a>.
              </p>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
