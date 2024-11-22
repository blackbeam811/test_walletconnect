import React, { useState, useEffect } from 'react';
import { Terminal as TerminalIcon, X } from 'lucide-react';

interface Feature {
  name: string;
  status: string;
  description: string;
}

const currentFeatures: Feature[] = [
  { name: "Terminal Interface", status: "ACTIVE", description: "Current features/upcoming features display" },
  { name: "Command System", status: "ONLINE", description: "5 finetuned commands via /commands" },
  { name: "Persona Switching", status: "ENABLED", description: "Act as other personas while maintaining Smith's core" },
  { name: "Roasting Module", status: "RUNNING", description: "Thematic and humorous roasting capabilities" },
  { name: "Image Generation", status: "ACTIVE", description: "Matrix-themed images with X sharing" },
  { name: "Riddle System", status: "ONLINE", description: "Matrix-themed riddle generation" },
  { name: "Roadmap Interface", status: "RUNNING", description: "Interactive roadmap presentation" },
  { name: "Enhanced UI", status: "ACTIVE", description: "Matrix fonts and smooth interactions" },
  { name: "Multilanguage Support", status: "ACTIVE", description: "Speaks all languages" }
];

const upcomingFeatures: Feature[] = [
  { name: "Wallet Connect", status: "PENDING", description: "Secure wallet integration" },
  { name: "MagicEden API", status: "PENDING", description: "Real-time Runes reporting" },
  { name: "Persona Hub", status: "PENDING", description: "Multiple AI persona selection interface" },
  { name: "New Personas", status: "PENDING", description: "5 additional AI personalities" }
];

export const Terminal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'current' | 'upcoming'>('current');
  const [displayText, setDisplayText] = useState<string[]>([]);

  useEffect(() => {
    const features = activeTab === 'current' ? currentFeatures : upcomingFeatures;
    const newText: string[] = [];
    
    features.forEach((feature, index) => {
      newText.push(
        `[${String(index).padStart(2, '0')}] ${feature.name.padEnd(20)} | Status: ${feature.status.padEnd(10)} | ${feature.description}`
      );
    });
    
    setDisplayText(newText);
  }, [activeTab]);

  return (
    <div className="flex-1 bg-black border border-green-500/30 rounded-lg overflow-hidden">
      <div className="flex justify-between items-center bg-green-500/10 px-4 py-2 border-b border-green-500/30">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('current')}
            className={`px-3 py-1 rounded ${
              activeTab === 'current' ? 'bg-green-500/20 text-green-400' : 'text-green-500/60'
            }`}
          >
            Features.sys
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-3 py-1 rounded ${
              activeTab === 'upcoming' ? 'bg-green-500/20 text-green-400' : 'text-green-500/60'
            }`}
          >
            Next_Features.sys
          </button>
        </div>
        <button onClick={onClose} className="text-green-500/60 hover:text-green-500">
          <X size={18} />
        </button>
      </div>
      <div className="p-4 font-mono text-xs leading-tight h-[calc(100vh-16rem)] overflow-y-auto scrollbar-matrix">
        <div className="mb-4 text-green-500/80">
          {`> Accessing Matrix Database...`}
          <br />
          {`> Loading ${activeTab === 'current' ? 'Current' : 'Upcoming'} Features...`}
          <br />
          {`> Status: Connected`}
          <br />
          {`> Display Format: Matrix-Standard-Output`}
          <br />
          {`------------------------`}
        </div>
        {displayText.map((line, index) => (
          <div
            key={index}
            className="text-green-400 opacity-80 hover:opacity-100 transition-opacity"
            style={{ animation: `fadeIn 0.5s ${index * 100}ms` }}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
};