import { useStore } from '@nanostores/preact';
import { messagesStore, promptStore } from '../store';
import { MessageList } from './MessageList';
import { PromptArea } from './PromptArea';
import '../styles/terminal.css';

export function TerminalComponent() {
  const messages = useStore(messagesStore);
  const activePrompt = useStore(promptStore);

  return (
    <div className="clack-terminal">
      <div className="clack-terminal-header">
        <span className="clack-symbol">◆</span>
        <span className="clack-title">preact-clack-terminal</span>
        <span className="clack-symbol">▲</span>
      </div>
      <MessageList messages={messages} />
      <PromptArea activePrompt={activePrompt} />
    </div>
  );
}
