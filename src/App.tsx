import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Chat } from './pages/Chat';
import { AgentSmithProvider } from './memory/AgentSmithMemory';

function App() {
  return (
    <AgentSmithProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </AgentSmithProvider>
  );
}

export default App;