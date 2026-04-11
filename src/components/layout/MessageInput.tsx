import React, { useState, useRef } from 'react';
import { 
  Paperclip, Send, Smile, AtSign, 
  X, File as FileIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { useAppStore } from '../../store/useAppStore';

interface MessageInputProps {
  channelName: string;
  onSend?: (text: string, attachments: File[]) => void;
}

const COMMON_EMOJIS = ['👍', '❤️', '😂', '🔥', '🤯', '🎉', '✨', '🚀', '👀', '💯', '🤔', '🙌'];

export const MessageInput: React.FC<MessageInputProps> = ({ channelName, onSend }) => {
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionIndex, setMentionIndex] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const activeConversationId = useAppStore(state => state.activeConversationId);
  const conversationMeta = useAppStore(state => state.conversationMeta);
  const currentMeta = activeConversationId ? conversationMeta[activeConversationId] : null;
  
  // Potential mentions from online users and friends
  const onlineUsers = currentMeta?.online || [];
  const filteredMentions = mentionQuery !== null 
    ? onlineUsers.filter(u => u.name.toLowerCase().includes(mentionQuery.toLowerCase()))
    : [];

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);

    // Mention detection
    const cursor = e.target.selectionStart;
    const textBeforeCursor = val.slice(0, cursor);
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);

    if (mentionMatch) {
      setMentionQuery(mentionMatch[1]);
      setMentionIndex(0);
    } else {
      setMentionQuery(null);
    }

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const insertEmoji = (emoji: string) => {
    setText(prev => prev + emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  const insertMention = (userName: string) => {
    if (mentionQuery === null) return;
    const cursor = textareaRef.current?.selectionStart || 0;
    const textBeforeMention = text.slice(0, cursor - mentionQuery.length - 1);
    const textAfterMention = text.slice(cursor);
    setText(textBeforeMention + `@${userName} ` + textAfterMention);
    setMentionQuery(null);
    textareaRef.current?.focus();
  };

  const handleSend = () => {
    if (!text.trim() && attachments.length === 0) return;
    onSend?.(text, attachments);
    setText('');
    setAttachments([]);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (mentionQuery !== null && filteredMentions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setMentionIndex(prev => (prev + 1) % filteredMentions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setMentionIndex(prev => (prev - 1 + filteredMentions.length) % filteredMentions.length);
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        insertMention(filteredMentions[mentionIndex].name);
      } else if (e.key === 'Escape') {
        setMentionQuery(null);
      }
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative group/input w-full">
      {/* Mention Popup */}
      <AnimatePresence>
        {mentionQuery !== null && filteredMentions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute bottom-full left-0 mb-3 w-64 bg-[#0F0F12]/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden z-[100]"
          >
            <div className="p-2 border-b border-white/[0.03] bg-white/[0.02]">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30 px-2">Mentions</span>
            </div>
            <div className="max-h-60 overflow-y-auto py-1.5 custom-scrollbar-compact">
              {filteredMentions.map((user, i) => (
                <button
                  key={user.name}
                  onClick={() => insertMention(user.name)}
                  onMouseEnter={() => setMentionIndex(i)}
                  className={clsx(
                    "w-full flex items-center gap-3 px-3 py-2 text-left transition-all",
                    i === mentionIndex ? "bg-primary/15 text-primary" : "text-foreground/60 hover:bg-white/[0.03]"
                  )}
                >
                  <img src={user.avatar} alt={user.name} className="h-6 w-6 rounded-lg ring-1 ring-white/10" />
                  <span className="text-[13px] font-bold truncate">{user.name}</span>
                  {i === mentionIndex && <AtSign size={12} className="ml-auto opacity-40" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emoji Picker Popup */}
      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute bottom-full right-0 mb-3 p-3 bg-[#0F0F12]/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl z-[100]"
          >
            <div className="grid grid-cols-4 gap-1.5">
              {COMMON_EMOJIS.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => insertEmoji(emoji)}
                  className="h-10 w-10 flex items-center justify-center text-xl rounded-xl hover:bg-white/5 hover:scale-110 active:scale-90 transition-all"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={clsx(
        "relative bg-transparent transition-all duration-500 overflow-hidden",
        attachments.length > 0 && "pt-2"
      )}>
        {/* Attachment Previews */}
        <AnimatePresence>
          {attachments.length > 0 && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex flex-wrap gap-2 px-4 pb-2 border-b border-white/[0.03]"
            >
              {attachments.map((file, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="relative group/thumb h-16 w-16 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center overflow-hidden"
                >
                  {file.type.startsWith('image/') ? (
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt="preview" 
                      className="h-full w-full object-cover opacity-60 group-hover/thumb:opacity-90 transition-opacity" 
                    />
                  ) : (
                    <FileIcon size={20} className="text-foreground/20" />
                  )}
                  <button 
                    onClick={() => removeAttachment(i)}
                    className="absolute top-1 right-1 h-5 w-5 rounded-lg bg-black/60 text-white flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity hover:bg-rose-500"
                  >
                    <X size={10} strokeWidth={3} />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input & Main Actions */}
        <div className="flex items-end gap-1.5 px-3 py-2">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            multiple 
            onChange={handleFileChange} 
          />
          <div className="flex items-center gap-1 shrink-0 pb-1.5">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className={clsx(
                "p-2 shrink-0 rounded-xl transition-all duration-300",
                attachments.length > 0 ? "text-primary bg-primary/10" : "text-foreground/15 hover:text-primary hover:bg-white/5"
              )}
              title="Attach File"
            >
              <Paperclip size={18} />
            </button>
            
            <button 
              onClick={() => {
                setText(prev => prev + '@');
                textareaRef.current?.focus();
              }}
              className={clsx(
                "p-2 shrink-0 rounded-xl transition-all duration-300",
                mentionQuery !== null ? "text-primary bg-primary/10" : "text-foreground/15 hover:text-primary hover:bg-white/5"
              )}
              title="Mention User"
            >
              <AtSign size={18} />
            </button>
          </div>
          
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={`Message #${channelName}`}
            className="flex-grow bg-transparent border-0 focus:ring-0 text-[14px] py-2.5 px-1 resize-none text-foreground placeholder:text-foreground/20 min-h-[40px] max-h-[220px] font-bold leading-relaxed outline-none"
          />

          <div className="flex items-center gap-1.5 shrink-0 pb-1">
            <button 
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={clsx(
                "p-2.5 rounded-xl transition-all duration-300",
                showEmojiPicker ? "text-amber-400 bg-amber-400/10" : "text-foreground/15 hover:text-amber-400 hover:bg-white/5"
              )}
              title="Choose Emoji"
            >
              <Smile size={18} />
            </button>

            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={handleSend}
              disabled={!text.trim() && attachments.length === 0}
              className={clsx(
                'h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-500',
                (text.trim() || attachments.length > 0)
                  ? 'bg-primary shadow-[0_4px_20px_rgba(99,102,241,0.4)] text-white hover:scale-105'
                  : 'bg-white/[0.04] text-foreground/10 cursor-not-allowed opacity-40'
              )}
            >
              <Send size={16} strokeWidth={2.5} className={clsx((text.trim() || attachments.length > 0) && "translate-x-0.5 -translate-y-0.5")} />
            </motion.button>
          </div>
        </div>

        {/* Dynamic Underline */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-700" />
      </div>

      {/* Helper text */}
      <div className="mt-2.5 flex items-center justify-end px-2">
        <div className="flex items-center gap-1.5 opacity-0 group-focus-within/input:opacity-100 transition-opacity">
          <kbd className="px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.1] text-[8px] font-black text-foreground/30">Enter</kbd>
          <span className="text-[8px] font-black text-foreground/10 uppercase tracking-widest">to send</span>
        </div>
      </div>
    </div>
  );
};
