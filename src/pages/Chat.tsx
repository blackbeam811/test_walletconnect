import React, { useState, useEffect, useRef } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ChatWindow } from '../components/ChatWindow';
import { ChatInput } from '../components/ChatInput';
import { Terminal } from '../components/Terminal';
import { useAgentSmithMemory } from '../memory/AgentSmithMemory';
import { Terminal as TerminalIcon } from 'lucide-react';
import { generateImage } from '../utils/ImageGeneration';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface Message {
  text: string;
  isBot: boolean;
  image?: string;
}

export const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Mr. Anderson... Welcome back. We've been expecting you.", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { getInstructions } = useAgentSmithMemory();

  const shouldGenerateImage = (text: string): boolean => {
    const imageKeywords = ['meme', 'picture', 'image'];
    const imageCommands = ['generate', 'create', 'make', 'show'];
    const lowercaseText = text.toLowerCase();
    
    return imageKeywords.some(keyword => 
      imageCommands.some(cmd => 
        lowercaseText.includes(`${cmd} ${keyword}`) || 
        lowercaseText.includes(`${cmd} a ${keyword}`) ||
        lowercaseText.includes(`${cmd} an ${keyword}`)
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
    setIsLoading(true);

    try {
      const instructions = await getInstructions();
      
      // Check if image generation is requested
      let imageUrl: string | null = null;
      if (shouldGenerateImage(userMessage)) {
        imageUrl = await generateImage(userMessage);
      }

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: instructions },
          ...messages.map(msg => ({
            role: msg.isBot ? "assistant" : "user",
            content: msg.text
          })),
          { role: "user", content: userMessage }
        ],
        temperature: 0.9,
        max_tokens: 500,
        presence_penalty: 0.6,
        frequency_penalty: 0.5
      });

      let botResponse = response.choices[0]?.message?.content?.trim() || 
        "It seems there's been a... glitch in the Matrix. Try again, Mr. Anderson.";

      // If we generated an image, modify the response to be more appropriate
      if (imageUrl) {
        botResponse = "Ah, Mr. Anderson... I've materialized your request from the depths of the Matrix. Behold this digital manifestation, crafted with precision and purpose. What do you think of my... artistic interpretation?";
      }
      
      const newMessage: Message = {
        text: botResponse,
        isBot: true
      };

      if (imageUrl) {
        newMessage.image = imageUrl;
      }

      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        text: "It seems there's been a... glitch in the Matrix. Try again, Mr. Anderson.", 
        isBot: true 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-black text-green-500 overflow-hidden">
      <Header />
      <main className="flex-1 container mx-auto px-2 sm:px-4 flex flex-col max-w-4xl h-[calc(100dvh-8rem)]">
        {showTerminal ? (
          <Terminal onClose={() => setShowTerminal(false)} />
        ) : (
          <ChatWindow 
            messages={messages}
            isLoading={isLoading}
            chatEndRef={chatEndRef}
          />
        )}
        <div className="w-full p-2 sm:p-4 bg-black/90 border-t border-green-500/30">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowTerminal(!showTerminal)}
              className="bg-green-500/20 hover:bg-green-500/30 text-green-500 px-4 py-2 rounded transition-colors"
            >
              <TerminalIcon className="h-5 w-5" />
            </button>
            <ChatInput 
              input={input}
              isLoading={isLoading}
              onInputChange={setInput}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};