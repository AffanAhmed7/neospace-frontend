import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';
import { Hexagon, Zap, Shield, Heart, Users, Globe } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="landing-wrapper">
      <Navbar />

      <main className="pt-24 lg:pt-32 pb-24">
        {/* Hero Section */}
        <section className="max-w-4xl mx-auto px-6 text-center mb-16 lg:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-8 leading-tight">
              Communication <span className="text-primary italic">reimagined</span>
            </h1>
            <p className="text-base md:text-lg text-foreground/50 max-w-xl mx-auto leading-relaxed font-medium">
              We started NeoPlane with a simple idea: that elite collaboration should be effortless, fast, and secure.
            </p>
          </motion.div>
        </section>

        {/* Story Section */}
        <section className="max-w-7xl mx-auto px-6 mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-square rounded-[40px] bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border border-white/5 flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 group-hover:opacity-30 transition-opacity" />
                <Hexagon size={160} className="text-primary/40 animate-float" strokeWidth={1} />
                
                {/* Decorative blobs */}
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/20 blur-[60px] rounded-full" />
                <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-indigo-500/20 blur-[80px] rounded-full" />
              </div>
            </motion.div>
 
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col gap-8"
            >
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-snug">
                Built for <span className="text-primary">deep work</span>
              </h2>
              <div className="space-y-6 text-lg text-foreground/50 leading-relaxed font-medium">
                <p>
                  In a world of constant pings and notifications, we believe in deep work. NeoPlane is designed to organize the chaos, allowing you to move fast without losing focus.
                </p>
                <p>
                  Whether you're a small collective or a global enterprise, NeoPlane provides the infrastructure for seamless collaboration. Our platform is built on transparency, performance, and trust.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-8 pt-6">
                <div>
                  <p className="text-3xl font-bold text-foreground">2026</p>
                  <p className="text-sm font-bold text-foreground/30 uppercase tracking-widest mt-1">Founded</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">100%</p>
                  <p className="text-sm font-bold text-foreground/30 uppercase tracking-widest mt-1">Privacy Focused</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Values Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-xs sm:text-xl font-bold text-foreground/40 uppercase tracking-[0.3em]">Core DNA</h2>
          </div>
          
          <div className="grid grid-cols-3 gap-3 sm:gap-8">
            {[
              { icon: Zap, title: "Speed", desc: "Performance is a feature. We optimize every millisecond." },
              { icon: Shield, title: "Privacy", desc: "Your data is yours. Privacy is a fundamental human right." },
              { icon: Heart, title: "Focus", desc: "Power lies in clarity. We remove the noise." }
            ].map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-card/10 border border-white/5 backdrop-blur-xl hover:border-primary/30 transition-all group flex flex-col items-center text-center gap-3 sm:gap-6"
              >
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shrink-0">
                  <value.icon className="w-5 h-5 sm:w-7 sm:h-7" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col items-center">
                  <h3 className="text-[10px] sm:text-xl font-bold text-foreground mb-0.5 sm:mb-3">{value.title}</h3>
                  <p className="hidden sm:block text-foreground/50 leading-relaxed font-medium">{value.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
