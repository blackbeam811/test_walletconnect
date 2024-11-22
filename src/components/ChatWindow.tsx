import React, { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { ChatMessage } from './ChatMessage';

interface Message {
  text: string;
  isBot: boolean;
  image?: string;
}

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  chatEndRef: React.RefObject<HTMLDivElement>;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  isLoading,
  chatEndRef,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [isNearBottom, setIsNearBottom] = useState(true);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer && shouldAutoScroll) {
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior
      });
    }
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const scrolledToBottom = scrollHeight - (scrollTop + clientHeight) < 100;
      setIsNearBottom(scrolledToBottom);
      setShouldAutoScroll(scrolledToBottom);
    }
  };

  useEffect(() => {
    if (isNearBottom) {
      const timeoutId = setTimeout(() => scrollToBottom(), 100);
      return () => clearTimeout(timeoutId);
    }
  }, [messages, isLoading, isNearBottom]);

  useEffect(() => {
    scrollToBottom('auto');
    const handleResize = () => {
      if (isNearBottom) {
        scrollToBottom('auto');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div 
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-matrix space-y-2 glass-effect rounded-lg p-2 sm:p-4 w-full max-h-[calc(100dvh-10rem)]"
    >
      <div className="max-w-full">
        {messages.map((message, index) => (
          <ChatMessage 
            key={index} 
            message={message.text} 
            isBot={message.isBot}
            image={message.image}
          />
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 p-4 bg-black/40 text-green-500 rounded">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Processing...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      {!isNearBottom && messages.length > 0 && (
        <button
          onClick={() => {
            setShouldAutoScroll(true);
            scrollToBottom();
          }}
          className="fixed bottom-20 right-4 bg-green-500/20 hover:bg-green-500/30 text-green-500 px-4 py-2 rounded-full shadow-lg transition-all transform hover:scale-105"
        >
          ↓
        </button>
      )}
    </div>
  );
};