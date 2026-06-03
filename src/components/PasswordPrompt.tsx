import { useState, useRef, useEffect } from 'preact/hooks';
import { S_PROMPT, S_INPUT, S_PASSWORD_MASK } from '../common';

interface Props {
  message: string;
  mask?: string;
  validate?: (v: string) => string | void | Promise<string | void>;
  onSubmit: (value: string) => void;
  onCancel: () => void;
}

export function PasswordPrompt({
  message,
  validate,
  mask = S_PASSWORD_MASK,
  onSubmit,
  onCancel,
}: Props) {
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async () => {
    setError(null);
    if (validate) {
      const err = await validate(input);
      if (err) {
        setError(err);
        return;
      }
    }
    onSubmit(input);
  };

  const handleKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
    if (e.key === 'Escape') onCancel();
  };

  return (
    <div className="clack-prompt clack-password-prompt">
      <div className="clack-prompt-message">
        <span className="clack-prompt-symbol">{S_PROMPT}</span>
        <span className="clack-prompt-text">{message}</span>
      </div>
      <div className="clack-input-wrapper">
        <span className="clack-input-symbol">{S_INPUT}</span>
        <div style={{ position: 'relative', width: '100%' }}>
          <input
            ref={inputRef}
            style={{ position: 'absolute', opacity: '0' }}
            value={input}
            onInput={(e) => setInput((e.target as HTMLInputElement).value)}
            onKeyDown={handleKey}
            autoComplete="off"
          />
          <input
            type="text"
            className="clack-text-input"
            value={mask.repeat(input.length)}
            onFocus={() => inputRef.current!.focus()}
            onInput={(e) => setInput((e.target as HTMLInputElement).value)}
            onKeyDown={handleKey}
            placeholder={mask.repeat(8)}
            autoComplete="off"
          />
        </div>
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
