import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';
import { Book, FileText, UserCheck, ShieldAlert, Scale, Info } from 'lucide-react';

export const TermsPage: React.FC = () => {
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
            <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto mb-8">
              <Book size={32} strokeWidth={1.5} />
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
              Terms of <span className="text-primary italic">Service</span>
            </h1>
            <p className="text-base md:text-lg text-foreground/50 max-w-xl mx-auto leading-relaxed font-medium">
              The rules of the road. By using NeoPlane, you agree to these terms. We've tried to keep them simple.
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
                <UserCheck size={20} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">1. Acceptance of Terms</h2>
                <p className="text-foreground/50 leading-relaxed font-medium">
                  By accessing or using NeoPlane, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the service.
                </p>
              </div>
            </div>

            {/* Section 2 */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-card border border-white/5 flex items-center justify-center text-foreground/40 mt-1">
                <FileText size={20} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">2. User Accounts</h2>
                <p className="text-foreground/50 leading-relaxed font-medium">
                  You are responsible for maintaining the security of your account and any activities that occur under your account. You must notify us immediately of any unauthorized use.
                </p>
              </div>
            </div>

            {/* Section 3 */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-card border border-white/5 flex items-center justify-center text-foreground/40 mt-1">
                <ShieldAlert size={20} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">3. Prohibited Conduct</h2>
                <p className="text-foreground/50 leading-relaxed font-medium">
                  You agree not to use NeoPlane for any unlawful purpose or in any way that could harm, disable, or overburden the service. This includes harassment, spreading malware, or attempting to compromise user accounts.
                </p>
              </div>
            </div>

            {/* Section 4 */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-card border border-white/5 flex items-center justify-center text-foreground/40 mt-1">
                <Scale size={20} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">4. Intellectual Property</h2>
                <p className="text-foreground/50 leading-relaxed font-medium">
                  The service and its original content are and will remain the exclusive property of NeoPlane and its licensors.
                </p>
              </div>
            </div>

            {/* Section 5 */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-card border border-white/5 flex items-center justify-center text-foreground/40 mt-1">
                <Info size={20} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">5. Termination</h2>
                <p className="text-foreground/50 leading-relaxed font-medium">
                  We reserve the right to terminate or suspend your account and access to the service at our sole discretion, without notice, for conduct that we believe violates these Terms.
                </p>
              </div>
            </div>

            {/* Contact Footer */}
            <div className="pt-12 border-t border-white/5 text-center">
              <p className="text-foreground/40 text-sm font-medium">
                Got a question about our terms? <a href="/contact" className="text-primary hover:underline font-bold">Get in touch</a>.
              </p>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
