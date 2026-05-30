import { useEffect, useRef } from 'preact/hooks';
import type { MessageEntry, PromptData } from '../types';
import { SelectPrompt } from './SelectPrompt';
import { TextPrompt } from './TextPrompt';
import { ConfirmPrompt } from './ConfirmPrompt';
import { PasswordPrompt } from './PasswordPrompt';
import { MultiselectPrompt } from './MultiselectPrompt';
import { AutocompletePrompt } from './AutocompletePrompt';
import { useStore } from '@nanostores/preact';
import { spinnerStore, tasksStore } from '../store';

interface Props {
  messages: MessageEntry[];
  activePrompt: PromptData | null;
}

function getPrefix(type: MessageEntry['type']) {
  switch (type) {
    case 'result':
      return '└';
    case 'system':
      return '◆';
    case 'spinner':
      return '◌';
    default:
      return '│';
  }
}

export function MessageList({ messages, activePrompt }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const spinner = useStore(spinnerStore);
  const tasks = useStore(tasksStore);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, activePrompt, spinner, tasks]);

  return (
    <div ref={containerRef} className="clack-stream">
      {messages.map((msg, idx) => (
        <div key={idx} className={`clack-line clack-${msg.type}`}>
          <span className="clack-prefix">{getPrefix(msg.type)}</span>
          <span className="clack-content">{msg.content}</span>
        </div>
      ))}
      {spinner?.active && (
        <div className="clack-line clack-spinner">
          <span className="clack-prefix">◌</span>
          <span className="clack-content">{spinner.text}</span>
        </div>
      )}
      {tasks.map((task, i) => (
        <div key={i} className="clack-line clack-task">
          <span className="clack-prefix">
            {task.status === 'success'
              ? '✔'
              : task.status === 'error'
                ? '✖'
                : '◌'}
          </span>
          <span className="clack-content">{task.title}</span>
        </div>
      ))}
      {activePrompt?.type === 'select' && (
        <SelectPrompt
          message={activePrompt.message}
          options={activePrompt.options}
          onSelect={activePrompt.resolve}
          onCancel={() => activePrompt.reject(new Error('Cancelled'))}
        />
      )}
      {activePrompt?.type === 'text' && (
        <TextPrompt
          message={activePrompt.message}
          options={activePrompt.options}
          parser={activePrompt.parser}
          onSubmit={activePrompt.resolve}
          onCancel={() => activePrompt.reject(new Error('Cancelled'))}
        />
      )}
      {activePrompt?.type === 'password' && (
        <PasswordPrompt
          message={activePrompt.message}
          mask={activePrompt.mask}
          validate={activePrompt.validate}
          onSubmit={activePrompt.resolve}
          onCancel={() => activePrompt.reject(new Error('Cancelled'))}
        />
      )}
      {activePrompt?.type === 'confirm' && (
        <ConfirmPrompt
          message={activePrompt.message}
          yesLabel={activePrompt.yesLabel}
          noLabel={activePrompt.noLabel}
          onConfirm={activePrompt.resolve}
          onCancel={() => activePrompt.reject(new Error('Cancelled'))}
        />
      )}
      {activePrompt?.type === 'multiselect' && (
        <MultiselectPrompt
          message={activePrompt.message}
          options={activePrompt.options}
          required={activePrompt.required}
          onSubmit={activePrompt.resolve}
          onCancel={() => activePrompt.reject(new Error('Cancelled'))}
        />
      )}
      {activePrompt?.type === 'autocomplete' && (
        <AutocompletePrompt
          message={activePrompt.message}
          options={activePrompt.options}
          placeholder={activePrompt.placeholder}
          maxItems={activePrompt.maxItems}
          onSubmit={activePrompt.resolve}
          onCancel={() => activePrompt.reject(new Error('Cancelled'))}
        />
      )}
    </div>
  );
}
