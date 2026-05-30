import { atom } from 'nanostores';
import type { MessageEntry, PromptData, Task } from './types';

export const messagesStore = atom<MessageEntry[]>([]);
export const promptStore = atom<PromptData | null>(null);
export const spinnerStore = atom<{
  id: string;
  text: string;
  active: boolean;
} | null>(null);
export const tasksStore = atom<Task[]>([]);
