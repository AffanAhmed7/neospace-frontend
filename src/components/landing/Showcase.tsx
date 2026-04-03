import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Hash, FileText, Send, Smile, Paperclip } from 'lucide-react';

export const Showcase: React.FC = () => {
  return (
    <section id="showcase" className="py-24 bg-surface/30 relative">
      <div className="max-w-7xl mx-auto px-6 text-center mb-16">
        <h2 className="text-4xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
          Everything you need to <span className="text-primary italic">work together</span> efficiently.
        </h2>
        <p className="text-xl text-foreground/50 max-w-2xl mx-auto">
          Built with attention to detail. No clutter, just the features you need for high-speed collaboration.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <motion.div
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 1, ease: "easeOut" }}
           className="showcase-container"
        >
          {/* Top Bar */}
          <div className="mockup-header">
             <div className="flex items-center gap-4">
                <div className="h-3 w-3 rounded-full bg-red-500/50" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
                <div className="h-3 w-3 rounded-full bg-green-500/50" />
                <div className="h-8 w-[1px] bg-border mx-2" />
                <div className="flex items-center gap-2 px-3 py-1 bg-surface rounded-lg">
                   <Hash size={14} className="text-foreground/40" />
                   <span className="text-xs font-bold text-foreground">product-launches</span>
                </div>
             </div>
             <div className="flex items-center gap-4">
                <div className="h-8 w-8 rounded-full bg-surface" />
                <div className="h-8 w-8 rounded-full bg-surface" />
                <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/20" />
             </div>
          </div>

          <div className="flex-grow flex overflow-hidden">
             {/* Left Column (Main Chat) */}
             <div className="flex-grow flex flex-col border-r border-border overflow-hidden">
                <div className="flex-grow p-8 flex flex-col gap-8 overflow-y-auto text-left">
                   <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-2xl bg-surface overflow-hidden">
                         <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=mark" alt="Mark" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                         <span className="text-xs font-bold text-foreground">Mark <span className="text-[10px] text-foreground/30 font-normal ml-1">Today at 10:15 AM</span></span>
                         <p className="text-sm text-foreground/70 leading-relaxed max-w-lg">
                            Has anyone reviewed the final proposal for the Q2 roadmap? I've attached the file below.
                         </p>

                         {/* File Preview */}
                         <div className="flex items-center gap-3 p-3 bg-surface/30 border border-border/50 rounded-2xl max-w-sm group/file hover:border-primary/30 transition-colors cursor-pointer">
                            <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover/file:bg-primary/20 transition-colors">
                               <FileText size={20} />
                            </div>
                            <div className="flex-grow min-w-0">
                               <p className="text-xs font-bold text-foreground truncate">Q2_Roadmap_Final.pdf</p>
                               <p className="text-[10px] text-foreground/40 uppercase tracking-widest font-bold">12.5 MB • PDF DOCUMENT</p>
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-2xl bg-surface overflow-hidden">
                         <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=lisa" alt="Lisa" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                         <span className="text-xs font-bold text-foreground">Lisa <span className="text-[10px] text-foreground/30 font-normal ml-1">Today at 10:18 AM</span></span>
                         <p className="text-sm text-foreground/70 leading-relaxed">
                            Looking good! I left some comments in the thread.
                         </p>
                         <div className="inline-flex items-center gap-2 px-2 py-1 bg-primary/5 border border-primary/20 rounded-lg text-[10px] font-bold text-primary cursor-pointer hover:bg-primary/10 transition-colors">
                            <MessageSquare size={12} />
                            <span>12 replies</span>
                            <span className="text-foreground/30">Last reply 5m ago</span>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Input Area */}
                <div className="p-8 pt-0">
                   <div className="rounded-2xl border border-border bg-background p-3 flex items-center gap-4">
                      <Paperclip size={20} className="text-foreground/30" />
                      <div className="flex-grow text-sm text-foreground/40 text-left">Message #product-launches</div>
                      <div className="flex items-center gap-3">
                         <Smile size={20} className="text-foreground/30" />
                         <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                            <Send size={18} />
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             {/* Right Column (Thread Detail) */}
             <div className="mockup-sidebar">
                <div className="h-14 border-b border-border flex items-center justify-between px-4 shrink-0 bg-background/30 backdrop-blur-sm">
                   <span className="text-xs font-bold text-foreground">Thread: Q2 Roadmap</span>
                   <button className="text-foreground/40 hover:text-foreground">
                      <MessageSquare size={16} />
                   </button>
                </div>
                <div className="flex-grow p-5 flex flex-col gap-6 overflow-y-auto text-left">
                   <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-xl bg-surface overflow-hidden">
                         <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=mark" alt="Mark" />
                      </div>
                      <div className="flex flex-col gap-1">
                         <span className="text-[10px] font-bold text-foreground">Mark <span className="text-foreground/30">10:15 AM</span></span>
                         <p className="text-xs text-foreground/60 leading-relaxed">I've attached the file below.</p>
                      </div>
                   </div>

                   <div className="border-t border-border pt-4" />

                   {[1, 2].map((i) => (
                      <div key={i} className="flex items-start gap-3">
                         <div className="h-8 w-8 rounded-xl bg-surface overflow-hidden">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 20}`} alt="User" />
                         </div>
                         <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-foreground">Team Member <span className="text-foreground/30">10:20 AM</span></span>
                            <p className="text-xs text-foreground/60 leading-relaxed">This looks great, the timeline is realistic.</p>
                         </div>
                      </div>
                   ))}
                </div>
                <div className="p-4 border-t border-border bg-background/20">
                   <div className="rounded-xl border border-border bg-background py-2 px-3 text-xs text-foreground/30 text-left">Reply...</div>
                </div>
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
