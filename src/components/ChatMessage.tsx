import React, { useState, useEffect } from 'react';
import { ImagePreview } from './ImagePreview';

interface ChatMessageProps {
  message: string;
  isBot: boolean;
  image?: string;
}

const linkRegex = /(https?:\/\/[^\s]+)/g;

const getDomainName = (url: string): string => {
  try {
    const domain = new URL(url).hostname;
    return domain.replace(/^www\./, '');
  } catch {
    return url;
  }
};

const formatMessageWithLinks = (text: string) => {
  const parts = text.split(linkRegex);
  return parts.map((part, index) => {
    if (part.match(linkRegex)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 underline break-all"
          onClick={(e) => e.stopPropagation()}
          title={part}
        >
          {getDomainName(part)}
        </a>
      );
    }
    return <span key={index}>{part}</span>;
  });
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isBot, image }) => {
  const [displayedMessage, setDisplayedMessage] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [showImage, setShowImage] = useState(true);

  useEffect(() => {
    if (isBot) {
      let index = 0;
      const interval = setInterval(() => {
        if (index < message.length) {
          setDisplayedMessage(message.slice(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
          setIsComplete(true);
        }
      }, 30);

      return () => clearInterval(interval);
    } else {
      setDisplayedMessage(message);
      setIsComplete(true);
    }
  }, [message, isBot]);

  return (
    <div className={`flex gap-4 p-4 ${isBot ? 'bg-black/40' : 'bg-black/20'} ${!isBot ? 'flex-row-reverse' : ''}`}>
      <div className="flex-shrink-0">
        {isBot ? (
          <img 
            src="https://i.imgur.com/rt6qxMj.png"
            alt="Agent Smith"
            className="h-8 w-8 rounded"
          />
        ) : (
          <img 
            src="https://i.imgur.com/dFWPBUm.png"
            alt="User"
            className="h-8 w-8 rounded"
          />
        )}
      </div>
      <div className={`flex-1 max-w-[calc(100%-4rem)] ${isBot ? 'text-left' : 'text-right'}`}>
        <p className={`whitespace-pre-wrap break-words chat-font ${isBot ? 'bot-message' : 'user-message'}`}>
          {isComplete ? formatMessageWithLinks(displayedMessage) : displayedMessage}
          {isBot && !isComplete && <span className="typing-indicator" />}
        </p>
        {image && showImage && (
          <div className="mt-2">
            <ImagePreview imageUrl={image} onClose={() => setShowImage(false)} />
          </div>
        )}
      </div>
    </div>
  );
};