import React, { useState, useCallback } from 'react';
import type { Chat } from '@google/genai';
import { TopicInput } from './components/TopicInput';
import { ModeSelector } from './components/ModeSelector';
import { ChatWindow } from './components/ChatWindow';
import { startChatSession, sendMessage } from './services/geminiService';
import type { StudyMode, ChatMessage } from './types';
import { BrainCircuitIcon } from './components/icons/Icons';
import { STUDY_MODES } from './constants';

const App: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [studyMode, setStudyMode] = useState<StudyMode>(STUDY_MODES[0]);
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleTopicSubmit = useCallback((newTopic: string) => {
    if (!newTopic.trim()) {
      setError("Please enter a study topic.");
      return;
    }
    setTopic(newTopic);
    setMessages([]);
    setError(null);
    try {
      const newChat = startChatSession(newTopic, studyMode);
      setChat(newChat);
      setMessages([{
        role: 'model',
        parts: [{ text: `Ok, let's study **${newTopic}**. I'm ready to help in **${studyMode}** mode. Ask me anything!` }],
      }]);
    } catch (e) {
      console.error(e);
      setError("Failed to initialize AI session. Please check your API key and try again.");
    }
  }, [studyMode]);

  const handleModeChange = useCallback((newMode: StudyMode) => {
    setStudyMode(newMode);
    if (topic) {
      setMessages([]);
      try {
        const newChat = startChatSession(topic, newMode);
        setChat(newChat);
         setMessages([{
          role: 'model',
          parts: [{ text: `Switched to **${newMode}** mode for **${topic}**. How can I assist?` }],
        }]);
      } catch (e) {
        console.error(e);
        setError("Failed to switch modes. Please check your API key and try again.");
      }
    }
  }, [topic]);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!chat) {
      setError("Chat session not initialized.");
      return;
    }

    const newUserMessage: ChatMessage = { role: 'user', parts: [{ text }] };
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);
    setError(null);

    const modelResponsePlaceholder: ChatMessage = { role: 'model', parts: [{ text: '' }] };
    setMessages(prev => [...prev, modelResponsePlaceholder]);

    try {
      await sendMessage(chat, text, (chunk) => {
        setMessages(prev => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage.role === 'model') {
            const updatedText = lastMessage.parts[0].text + chunk;
            // FIX: Explicitly type `updatedMessage` as `ChatMessage` to resolve a TypeScript inference issue.
            const updatedMessage: ChatMessage = { ...lastMessage, parts: [{ text: updatedText }] };
            return [...prev.slice(0, -1), updatedMessage];
          }
          return prev;
        });
      });
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Sorry, something went wrong: ${errorMessage}`);
      setMessages(prev => prev.slice(0, -1)); // Remove placeholder
    } finally {
      setIsLoading(false);
    }
  }, [chat]);
  
  const resetStudySession = () => {
    setTopic('');
    setMessages([]);
    setChat(null);
    setError(null);
    setStudyMode(STUDY_MODES[0]);
  }

  return (
    <div className="flex flex-col h-screen font-sans bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
        <div className="flex items-center space-x-3">
          <BrainCircuitIcon className="w-8 h-8 text-indigo-500" />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">AI Study Partner</h1>
        </div>
        {topic && (
          <button 
            onClick={resetStudySession} 
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
            New Topic
          </button>
        )}
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          {!topic ? (
            <TopicInput onSubmit={handleTopicSubmit} />
          ) : (
            <div className="flex flex-col flex-1 h-full">
              <div className="mb-6 p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Current Topic:</span>
                    <h2 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">{topic}</h2>
                  </div>
                  <ModeSelector currentMode={studyMode} onModeChange={handleModeChange} />
                </div>
              </div>
              <ChatWindow
                messages={messages}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
              />
            </div>
          )}
          {error && <div className="mt-4 text-center text-red-500 bg-red-100 dark:bg-red-900/20 p-3 rounded-md">{error}</div>}
        </div>
      </main>
    </div>
  );
};

export default App;