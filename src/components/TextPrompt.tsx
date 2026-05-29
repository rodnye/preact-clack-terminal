import { useState, useRef, useEffect } from 'preact/hooks';
import type { TextPromptOptions } from '../types';

interface Props<T> {
  message: string;
  options: TextPromptOptions<T>;
  parser: (raw: string) => T;
  onSubmit: (value: T) => void;
  onCancel: () => void;
}

export function TextPrompt<T>({
  message,
  options,
  parser,
  onSubmit,
  onCancel,
}: Props<T>) {
  const [input, setInput] = useState(options.initialValue || '');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async () => {
    setError(null);
    try {
      const parsed = parser(input);
      if (options.validate) {
        const validationError = await options.validate(parsed);
        if (validationError) {
          setError(validationError);
          return;
        }
      }
      onSubmit(parsed);
    } catch (err: any) {
      setError(err.message || 'Invalid input');
    }
  };

  const handleKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
    if (e.key === 'Escape') onCancel();
  };

  return (
    <div className="clack-prompt clack-text-prompt">
      <div className="clack-prompt-message">
        <span className="clack-prompt-symbol">◈</span>
        <span className="clack-prompt-text">{message}</span>
      </div>
      <div className="clack-input-wrapper">
        <span className="clack-input-symbol">❯</span>
        <input
          ref={inputRef}
          type="text"
          className="clack-text-input"
          value={input}
          onInput={(e) => setInput((e.target as HTMLInputElement).value)}
          onKeyDown={handleKey}
          placeholder={options.placeholder || ''}
          autoComplete="off"
        />
      </div>
      {error && (
        <div className="clack-validation-error">
          <span className="clack-error-symbol">▲</span>
          <span className="clack-error-text">{error}</span>
        </div>
      )}
      <div className="clack-prompt-hint">
        <span className="clack-hint-symbol">⏎</span>
        <span> submit </span>
        <span className="clack-hint-symbol">⎋</span>
        <span> cancel</span>
      </div>
    </div>
  );
}
