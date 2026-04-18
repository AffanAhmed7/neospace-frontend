import React, { useState, useRef } from 'react';
import { 
  Paperclip, Send, Smile, AtSign, 
  X, File as FileIcon, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { useAppStore } from '../../store/useAppStore';
import { useConversationsStore } from '../../store/useConversationsStore';
import { useMessagesStore } from '../../store/useMessagesStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { getSocket } from '../../lib/socket';
import api from '../../lib/api';
import axios from 'axios';
import { Avatar } from '../ui/Avatar';

interface MessageInputProps {
  channelName: string;
}




export const MessageInput: React.FC<MessageInputProps> = ({ channelName }) => {
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionIndex, setMentionIndex] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const activeConversationId = useAppStore(state => state.activeConversationId);
  const { conversations } = useConversationsStore();
  const { sendMessage } = useMessagesStore();
  const addToast = useSettingsStore(s => s.addToast);
  
  const conversation = conversations.find(c => c.id === activeConversationId);
  const participants = conversation?.participants.map(p => p.user) || [];
  
  const filteredMentions = mentionQuery !== null 
    ? participants.filter(u => u.username.toLowerCase().includes(mentionQuery.toLowerCase()))
    : [];

  // ─── Typing Indicators ──────────────────────────────────────────────────
  const handleTyping = () => {
    if (!activeConversationId) return;
    const socket = getSocket();
    
    // Clear existing timeout
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    // Emit start typing
    socket.emit('typing:start', { conversationId: activeConversationId });
    
    // Set timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing:stop', { conversationId: activeConversationId });
    }, 3000);
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);
    handleTyping();

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

  const uploadFile = async (file: File) => {
    try {
      // Upload via our backend (backend handles S3 upload, no CORS issues)
      const formData = new FormData();
      formData.append('file', file);

      const { data: { data } } = await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120000, // 2 min timeout for large files
      });

      return {
        url: data.publicUrl,
        name: file.name,
        type: file.type,
        size: file.size
      };
    } catch (err: any) {
      console.error('File upload failed:', err);
      
      if (err.response?.status === 400) {
        addToast(err.response.data?.message || 'File type not supported.', 'error');
      } else if (err.response?.status === 413) {
        addToast('File is too large. Max size is 25MB.', 'error');
      } else {
        addToast(`Upload failed: ${err.response?.data?.message || err.message || 'Unknown error'}`, 'error');
      }
      return null;
    }
  };

  const handleSend = async () => {
    if (!text.trim() && attachments.length === 0) return;
    if (!activeConversationId) return;

    setIsUploading(true);
    try {
      // Handle attachments
      const uploadedFiles = await Promise.all(attachments.map(uploadFile));
      const validFiles = uploadedFiles.filter(Boolean);

      // Send messages (currently one per file if multiple, or one message with multiple attachments if backend supports it)
      // Our backend message.service handles one file per message.
      // Send messages
      if (attachments.length > 0 && validFiles.length === 0) {
        addToast('No files were uploaded successfully.', 'error');
      }

      if (validFiles.length > 0) {
        for (const file of validFiles) {
          await sendMessage({
            conversationId: activeConversationId,
            content: '',
            type: file?.type.startsWith('image/') ? 'IMAGE' : 'FILE',
            fileUrl: file?.url,
            fileName: file?.name,
            fileSize: file?.size
          });
        }
      }

      if (text.trim()) {
        try {
          await sendMessage({
            conversationId: activeConversationId,
            content: text.trim()
          });
        } catch (err: unknown) {
          const error = err as { message: string };
          addToast(`Failed to send message: ${error.message}`, 'error');
        }
      }

      setText('');
      setAttachments([]);
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
      
      // Stop typing immediately
      const socket = getSocket();
      socket.emit('typing:stop', { conversationId: activeConversationId });
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsUploading(false);
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




  const insertMention = (userName: string) => {
    if (mentionQuery === null) return;
    const cursor = textareaRef.current?.selectionStart || 0;
    const textBeforeMention = text.slice(0, cursor - mentionQuery.length - 1);
    const textAfterMention = text.slice(cursor);
    setText(textBeforeMention + `@${userName} ` + textAfterMention);
    setMentionQuery(null);
    textareaRef.current?.focus();
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
        insertMention(filteredMentions[mentionIndex].username);
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
              {filteredMentions.map((u, i) => (
                <button
                  key={u.id}
                  onClick={() => insertMention(u.username)}
                  onMouseEnter={() => setMentionIndex(i)}
                  className={clsx(
                    "w-full flex items-center gap-3 px-3 py-2 text-left transition-all",
                    i === mentionIndex ? "bg-primary/15 text-primary" : "text-foreground/60 hover:bg-white/[0.03]"
                  )}
                >
                  <Avatar src={u.avatar} alt={u.username} size="sm" />
                  <span className="text-[13px] font-bold truncate">{u.username}</span>
                  {i === mentionIndex && <AtSign size={12} className="ml-auto opacity-40" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={clsx(
        "relative bg-transparent transition-all duration-500",
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
                  className={clsx(
                    "relative group/thumb rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center gap-3 overflow-hidden transition-all",
                    file.type.startsWith('image/') ? "h-16 w-16" : "h-12 px-3 min-w-[120px] max-w-[200px]"
                  )}
                >
                  {file.type.startsWith('image/') ? (
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt="preview" 
                      className="h-full w-full object-cover opacity-60 group-hover/thumb:opacity-90 transition-opacity" 
                    />
                  ) : (
                    <>
                      <FileIcon size={16} className="text-primary/60 shrink-0" />
                      <span className="text-[11px] font-bold text-foreground/40 truncate pr-4">{file.name}</span>
                    </>
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
          </div>
          
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            disabled={isUploading}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={isUploading ? "Uploading..." : `Message #${channelName}`}
            className="flex-grow bg-transparent border-0 focus:ring-0 text-[14px] py-2.5 px-1 resize-none text-foreground placeholder:text-foreground/20 min-h-[40px] max-h-[220px] font-bold leading-relaxed outline-none"
          />

          <div className="flex items-center gap-1.5 shrink-0 pb-1">
            <div className="relative">
              <AnimatePresence>
                {showEmojiPicker && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    className="absolute bottom-full right-0 mb-4 p-2 bg-[#0F0F12]/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl z-[100] w-[240px]"
                  >
                    <div className="grid grid-cols-6 gap-1">
                      {['👍', '❤️', '😂', '🔥', '🤯', '🎉', '👀', '✨', '🫡', '💯', '🚀', '🤔', '👋', '👏', '🙌', '🎈', '⭐', '🌈'].map(emoji => (
                        <button
                          key={emoji}
                          onClick={() => {
                            setText(prev => prev + emoji);
                            setShowEmojiPicker(false);
                            textareaRef.current?.focus();
                          }}
                          className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-all text-lg"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <button 
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={clsx(
                  "p-2.5 rounded-xl transition-all duration-300",
                  showEmojiPicker ? "text-amber-400 bg-amber-400/10" : "text-foreground/40 hover:text-amber-400 hover:bg-white/5"
                )}
                title="Choose Emoji"
              >
                <Smile size={18} />
              </button>
            </div>

            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={handleSend}
              disabled={(!text.trim() && attachments.length === 0) || isUploading}
              className={clsx(
                'h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-500',
                (text.trim() || attachments.length > 0) && !isUploading
                  ? 'bg-primary shadow-[0_4px_20px_rgba(99,102,241,0.4)] text-white hover:scale-105'
                  : 'bg-white/[0.04] text-foreground/10 cursor-not-allowed opacity-40'
              )}
            >
              {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} strokeWidth={2.5} className="translate-x-0.5 -translate-y-0.5" />}
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
