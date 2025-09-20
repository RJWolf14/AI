
import React, { useState } from 'react';
import { BookOpenIcon } from './icons/Icons';

interface TopicInputProps {
  onSubmit: (topic: string) => void;
}

export const TopicInput: React.FC<TopicInputProps> = ({ onSubmit }) => {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(topic);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 animate-fade-in">
      <div className="text-center">
        <BookOpenIcon className="w-16 h-16 mx-auto text-indigo-500 mb-4" />
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Welcome to your AI Study Partner!</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">What subject would you like to master today?</p>
      </div>
      <form onSubmit={handleSubmit} className="w-full max-w-lg">
        <div className="flex items-center border-b-2 border-indigo-500 py-2">
          <input
            className="appearance-none bg-transparent border-none w-full text-gray-700 dark:text-gray-200 mr-3 py-1 px-2 leading-tight focus:outline-none"
            type="text"
            placeholder="e.g., Quantum Physics, Renaissance Art, React.js"
            aria-label="Study topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <button
            className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-700 border-indigo-600 hover:border-indigo-700 text-sm border-4 text-white py-2 px-4 rounded-lg transition-colors disabled:bg-indigo-300"
            type="submit"
            disabled={!topic.trim()}
          >
            Start Studying
          </button>
        </div>
      </form>
    </div>
  );
};
