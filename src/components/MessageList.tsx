import { useEffect, useRef, useState } from 'preact/hooks';
import type { MessageEntry, PromptData } from '../types';

import { SelectPrompt } from './SelectPrompt';
import { TextPrompt } from './TextPrompt';
import { ConfirmPrompt } from './ConfirmPrompt';

interface Props {
  messages: MessageEntry[];
  activePrompt: PromptData | null;
}

function getPrefix(type: MessageEntry['type']) {
  switch (type) {
    case 'result':
      return '└';
    case 'system':
    case 'print':
    default:
      return '│';
  }
}

export function MessageList({ messages, activePrompt }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [prevMessagesLength, setPrevMessagesLength] = useState(messages.length);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: 'smooth',
    });

    if (messages.length > prevMessagesLength) {
      setPrevMessagesLength(messages.length);
    }
  }, [messages, activePrompt, prevMessagesLength]);

  return (
    <div ref={containerRef} className="clack-stream">
      {messages.length === 0 && (
        <div className="clack-line clack-system">
          <span className="clack-prefix">│</span>
          <span className="clack-content">Ready — awaiting command</span>
        </div>
      )}

      {messages.map((msg, idx) => (
        <div key={idx} className={`clack-line clack-${msg.type}`}>
          <span className="clack-prefix">{getPrefix(msg.type)}</span>
          <span className="clack-content">{msg.content}</span>
        </div>
      ))}

      {activePrompt?.type === 'select' && (
        <SelectPrompt
          message={activePrompt.message}
          options={activePrompt.options}
          onSelect={(value) => {
            activePrompt.resolve(value);
          }}
          onCancel={() => activePrompt.reject(new Error('Prompt cancelled'))}
        />
      )}

      {activePrompt?.type === 'text' && (
        <TextPrompt
          message={activePrompt.message}
          options={activePrompt.options}
          parser={activePrompt.parser}
          onSubmit={(value) => {
            activePrompt.resolve(value);
            activePrompt.options.initialValue = '';
          }}
          onCancel={() => activePrompt.reject(new Error('Prompt cancelled'))}
        />
      )}

      {activePrompt?.type === 'confirm' && (
        <ConfirmPrompt
          message={activePrompt.message}
          yesLabel={activePrompt.yesLabel}
          noLabel={activePrompt.noLabel}
          onConfirm={(value) => activePrompt.resolve(value)}
          onCancel={() => activePrompt.reject(new Error('Prompt cancelled'))}
        />
      )}
    </div>
  );
}
