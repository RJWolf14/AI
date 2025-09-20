import React from 'react';
import type { ChatMessage } from '../types';
import { UserIcon, BotIcon } from './icons/Icons';

interface MessageProps {
  message: ChatMessage;
  isLoading?: boolean;
}

const formatText = (text: string) => {
    // Simple formatter for newlines and bold text
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/\n/g, '<br />');
};


export const Message: React.FC<MessageProps> = ({ message, isLoading = false }) => {
  const isUser = message.role === 'user';

  const containerClasses = `flex items-start gap-4 ${isUser ? 'justify-end' : ''}`;
  const bubbleClasses = `max-w-xl px-5 py-3 rounded-2xl shadow-sm ${
    isUser
      ? 'bg-indigo-600 text-white rounded-br-lg'
      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-lg'
  }`;

  const Icon = isUser ? UserIcon : BotIcon;
  const iconClasses = `w-8 h-8 rounded-full p-1.5 ${
    isUser
        ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400'
        : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300'
  }`

  const textContent = message.parts[0].text;

  return (
    <div className={containerClasses}>
      {!isUser && <Icon className={iconClasses} />}
      <div className={bubbleClasses}>
        {isLoading && !textContent ? (
          <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 text-sm">
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Thinking...</span>
          </div>
        ) : (
          <div
            className="prose prose-sm dark:prose-invert max-w-none prose-p:my-0"
            dangerouslySetInnerHTML={{ __html: formatText(textContent) }}
          />
        )}
      </div>
      {isUser && <Icon className={iconClasses} />}
    </div>
  );
};