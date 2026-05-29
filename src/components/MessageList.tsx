import { useEffect, useRef } from 'preact/hooks';
import type { MessageEntry } from '../types';

interface Props {
  messages: MessageEntry[];
}

export function MessageList({ messages }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const getIcon = (type: MessageEntry['type']) => {
    if (type === 'print') return '▶';
    if (type === 'result') return '●';
    return '◆';
  };

  return (
    <div className="clack-messages" ref={containerRef}>
      {messages.length === 0 && (
        <div className="clack-message clack-system">
          <span className="clack-message-icon">◉</span>
          <span className="clack-message-text">
            Ready — use terminal methods
          </span>
        </div>
      )}
      {messages.map((msg, idx) => (
        <div key={idx} className={`clack-message clack-${msg.type}`}>
          <span className="clack-message-icon">{getIcon(msg.type)}</span>
          <span className="clack-message-text">{msg.content}</span>
        </div>
      ))}
    </div>
  );
}
