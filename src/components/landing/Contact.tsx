import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, User, MessageCircle, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    query: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.query) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${baseUrl}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setStatus('success');
        setFormData({ name: '', email: '', query: '' });
        // Reset success state after 5 seconds
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        throw new Error(data.message || 'Something went wrong');
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Failed to send message');
    }
  };

  return (
    <section id="contact" className="py-12 lg:py-24 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
          
          {/* Content Side */}
          <div className="lg:w-1/2 text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-7xl font-bold tracking-tight text-foreground mb-6">
                Establish <span className="text-primary italic">Contact</span>
              </h2>
              <p className="text-lg md:text-xl text-foreground/50 mb-10 leading-relaxed font-medium max-w-md">
                We'd love to hear from you. Drop us a message and we'll get back to you within 24 hours.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface/30 border border-border/50 group hover:border-primary/30 transition-all">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Email Us</p>
                    <p className="text-lg font-semibold text-foreground">affanahmedkhan34@gmail.com</p>
                  </div>
                </div>
                
              </div>
            </motion.div>
          </div>

          {/* Form Side */}
          <div className="lg:w-1/2 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="p-6 md:p-8 lg:p-10 bg-card/40 backdrop-blur-3xl border border-border rounded-[32px] shadow-2xl relative overflow-hidden"
            >
              {status === 'success' ? (
                <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                  <div className="h-20 w-20 rounded-full bg-accent/20 flex items-center justify-center text-accent mb-2">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Message Sent!</h3>
                  <p className="text-foreground/50 max-w-xs">
                    Thanks for reaching out. We've received your query and will be in touch soon.
                  </p>
                  <Button 
                    variant="ghost" 
                    onClick={() => setStatus('idle')}
                    className="mt-4"
                  >
                    Send another message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2 text-left">
                    <label htmlFor="name" className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest ml-1">Your Name</label>
                    <div className="relative">
                      <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20" />
                      <input
                        id="name"
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-foreground/5 border border-border rounded-2xl py-4 pl-12 pr-4 text-foreground placeholder:text-foreground/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 text-left">
                    <label htmlFor="email" className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest ml-1">Email (Optional)</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20" />
                      <input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-foreground/5 border border-border rounded-2xl py-4 pl-12 pr-4 text-foreground placeholder:text-foreground/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 text-left">
                    <label htmlFor="query" className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest ml-1">Message / Query</label>
                    <textarea
                      id="query"
                      required
                      placeholder="How can we help you?"
                      rows={4}
                      value={formData.query}
                      onChange={(e) => setFormData({ ...formData, query: e.target.value })}
                      className="w-full bg-foreground/5 border border-border rounded-2xl py-4 px-4 text-foreground placeholder:text-foreground/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all resize-none"
                    />
                  </div>

                  {status === 'error' && (
                    <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
                      <AlertCircle size={14} />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    isLoading={status === 'loading'}
                    className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl shadow-xl shadow-primary/20 group text-lg"
                  >
                    <span className="flex items-center justify-center gap-2">
                      Send Message
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </form>
              )}
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
