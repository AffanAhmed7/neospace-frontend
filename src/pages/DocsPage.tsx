import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';
import { 
  MessageSquare, Hash, Shield, Users, 
  FileText, Bell, Zap 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const docCategories = [
  {
    title: 'Getting Started',
    description: 'Set up your workspace and send your first message in under 2 minutes.',
    icon: Zap,
    articles: ['Quick Start Guide', 'Creating Your Account', 'Workspace Setup', 'Inviting Members'],
  },
  {
    title: 'Messaging',
    description: 'Everything you need to know about real-time conversations.',
    icon: MessageSquare,
    articles: ['Sending Messages', 'Threads & Replies', 'Reactions & Emojis', 'File Sharing'],
  },
  {
    title: 'Channels',
    description: 'Organize conversations by topic, team, or project.',
    icon: Hash,
    articles: ['Creating Channels', 'Public vs Private', 'Channel Settings', 'Pinned Messages'],
  },
  {
    title: 'User Management',
    description: 'Manage your team, roles, and permissions effortlessly.',
    icon: Users,
    articles: ['Adding Members', 'Roles & Permissions', 'Friend Requests', 'Profile Settings'],
  },
  {
    title: 'Notifications',
    description: 'Stay informed without the noise. Focus when it matters.',
    icon: Bell,
    articles: ['Notification Preferences', 'Focus Mode', 'Mute & Snooze', 'Desktop Alerts'],
  },
  {
    title: 'Privacy & Security',
    description: 'Your data, your rules. End-to-end protection by default.',
    icon: Shield,
    articles: ['Data Encryption', 'Privacy Controls', 'Two-Factor Auth', 'Session Management'],
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export const DocsPage: React.FC = () => {
  return (
    <div className="landing-wrapper">
      <Navbar />

      <main className="pt-24 lg:pt-32 pb-24">
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-6 text-center mb-16 lg:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex flex-col items-center gap-4"
          >
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              System <span className="text-primary italic">Orientation</span>
            </h1>
            <p className="text-base md:text-lg text-foreground/50 max-w-xl leading-relaxed font-medium">
              Everything you need to get the most out of NeoPlane. Clear, concise, and always up to date.
            </p>
          </motion.div>
        </section>

        {/* Categories Grid */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6"
          >
            {docCategories.map((cat) => (
              <motion.div
                key={cat.title}
                variants={item}
                className="group p-4 sm:p-7 rounded-2xl sm:rounded-3xl border border-border bg-card/20 backdrop-blur-sm hover:border-primary/20 hover:bg-card/40 transition-all duration-300 flex flex-col items-center justify-center text-center gap-4 sm:gap-5 cursor-pointer relative overflow-hidden"
              >
                {/* Header */}
                <div className="h-10 w-10 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl bg-primary/8 border border-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/15 transition-colors shrink-0">
                  <cat.icon className="w-5 h-5 sm:w-7 sm:h-7" strokeWidth={1.5} />
                </div>

                {/* Content */}
                <div className="flex flex-col items-center">
                  <h3 className="text-xs sm:text-lg font-bold text-foreground mb-1 sm:mb-1.5 tracking-tight">{cat.title}</h3>
                  <p className="hidden sm:block text-sm text-foreground/45 leading-relaxed font-medium">{cat.description}</p>
                </div>

                {/* Article List - Hidden on mobile for cleaner 2x3 grid */}
                <div className="hidden sm:flex flex-col gap-2 w-full mt-auto pt-3 border-t border-border/50">
                  {cat.articles.map((article) => (
                    <div 
                      key={article} 
                      className="flex items-center gap-2.5 text-xs text-foreground/40 hover:text-primary font-medium transition-colors"
                    >
                      <FileText size={12} className="shrink-0 opacity-50" />
                      <span>{article}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Footer spacer */}
        <div className="h-12" />
      </main>

      <Footer />
    </div>
  );
};
