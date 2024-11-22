import React from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  isLoading,
  onInputChange,
  onSubmit,
}) => (
  <form onSubmit={onSubmit} className="flex gap-2 w-full">
    <input
      type="text"
      value={input}
      onChange={(e) => onInputChange(e.target.value)}
      placeholder="Type /commands, I dare you"
      className="flex-1 bg-black/50 border border-green-500/30 rounded px-4 py-2 text-green-500 placeholder-green-500/50 focus:outline-none focus:border-green-500"
    />
    <button
      type="submit"
      disabled={isLoading}
      className="bg-green-500/20 hover:bg-green-500/30 text-green-500 px-4 py-2 rounded flex items-center gap-2 transition-colors disabled:opacity-50 whitespace-nowrap"
    >
      <Send className="h-5 w-5 sm:mr-2" />
      <span className="hidden sm:inline">Send</span>
    </button>
  </form>
);