import { useStore } from '@nanostores/preact';
import { messagesStore, promptStore } from '../store';
import { MessageList } from './MessageList';
import '../styles/terminal.css';

interface Props {
  header?: boolean;
}

export function TerminalComponent({ header = true }: Props) {
  const messages = useStore(messagesStore);

  const activePrompt = useStore(promptStore);

  return (
    <div className="clack-terminal">
      {header && (
        <div className="clack-header">
          <div className="clack-header-left">
            <span className="clack-dot" />
            <span className="clack-dot" />
            <span className="clack-dot" />
          </div>

          <div className="clack-header-title">preact-clack-terminal</div>
        </div>
      )}

      <MessageList messages={messages} activePrompt={activePrompt} />
    </div>
  );
}
