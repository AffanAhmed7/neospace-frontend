import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';
import { Shield, Eye, Lock, Database, Globe, Bell } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  const pLayers = [
    { icon: Database, title: "Data Integrity", desc: "Minimal collection strictly for core architecture." },
    { icon: Lock, title: "Zero Trust", desc: "E2EE for every packet in transit and at rest." },
    { icon: Eye, title: "Transparency", desc: "No tracking. No data selling. Absolute visibility." },
    { icon: Globe, title: "Sovereignty", desc: "Identity and data ownership remains with you." },
    { icon: Shield, title: "Security Core", desc: "Layered protection for the modern enterprise." },
    { icon: Bell, title: "Audit Tunnels", desc: "Proactive monitoring and instant security alerts." }
  ];

  return (
    <div className="landing-wrapper">
      <Navbar />

      <main className="pt-24 lg:pt-32 pb-24 text-center">
        {/* Hero Section */}
        <section className="max-w-4xl mx-auto px-6 mb-16 lg:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex flex-col items-center"
          >
            <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-8">
              <Shield size={32} strokeWidth={1.5} />
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
              Privacy <span className="text-primary italic">Infrastructure</span>
            </h1>
            <p className="text-base md:text-lg text-foreground/50 max-w-xl mx-auto leading-relaxed font-medium">
              Elite data protection by default. Engineered for teams that value absolute digital sovereignty.
            </p>
          </motion.div>
        </section>

        {/* Principles Grid */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6"
          >
            {pLayers.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-card/10 border border-white/5 backdrop-blur-xl hover:border-primary/30 transition-all flex flex-col items-center text-center gap-3 sm:gap-6"
              >
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shrink-0">
                  <p.icon className="w-5 h-5 sm:w-7 sm:h-7" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col items-center">
                  <h3 className="text-[10px] sm:text-lg font-bold text-foreground mb-0.5 sm:mb-2">{p.title}</h3>
                  <p className="hidden sm:block text-[13px] text-foreground/50 leading-relaxed font-medium">{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <div className="h-24 lg:h-32" />
      </main>

      <Footer />
    </div>
  );
};
