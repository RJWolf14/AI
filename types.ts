
import { STUDY_MODES } from './constants';

export type Role = 'user' | 'model';

export interface ChatMessage {
  role: Role;
  parts: [{ text: string }];
}

export type StudyMode = typeof STUDY_MODES[number];
