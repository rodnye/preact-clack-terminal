import { MessageEntry, PromptData, Task } from './types';
export declare const messagesStore: import('nanostores').PreinitializedWritableAtom<MessageEntry[]> & object;
export declare const promptStore: import('nanostores').PreinitializedWritableAtom<PromptData | null> & object;
export declare const spinnerStore: import('nanostores').PreinitializedWritableAtom<{
    id: string;
    text: string;
    active: boolean;
} | null> & object;
export declare const tasksStore: import('nanostores').PreinitializedWritableAtom<Task[]> & object;
