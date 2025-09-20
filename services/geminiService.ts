
import { GoogleGenAI, Chat } from '@google/genai';
import { getSystemPrompt } from '../constants';
import type { StudyMode } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const startChatSession = (topic: string, mode: StudyMode): Chat => {
  const systemInstruction = getSystemPrompt(mode, topic);
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction,
    },
  });
  return chat;
};

export const sendMessage = async (
  chat: Chat,
  message: string,
  onChunk: (chunk: string) => void
): Promise<void> => {
  try {
    const stream = await chat.sendMessageStream({ message });
    for await (const chunk of stream) {
      if (chunk.text) {
        onChunk(chunk.text);
      }
    }
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    throw new Error("Failed to get response from AI. Please check the console for details.");
  }
};
