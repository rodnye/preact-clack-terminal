import { MessageEntry, PromptData } from '../types';
interface Props {
    messages: MessageEntry[];
    activePrompt: PromptData | null;
}
export declare function MessageList({ messages, activePrompt }: Props): import("preact").JSX.Element;
export {};
