import { useEffect, useState } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import { messagesStore, promptStore } from '../store';
import { MessageList } from './MessageList';
import '../styles/animations.css';
import '../styles/terminal.css';

interface Props {
  header?: boolean;
}

export function TerminalComponent({ header = true }: Props) {
  const messages = useStore(messagesStore);
  const activePrompt = useStore(promptStore);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="clack-terminal"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1)' : 'scale(0.98)',
        transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
      }}
    >
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
