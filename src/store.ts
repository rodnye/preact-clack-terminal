import { atom } from 'nanostores';
import type { PromptData, MessageEntry } from './types';

export const messagesStore = atom<MessageEntry[]>([]);
export const promptStore = atom<PromptData | null>(null);
