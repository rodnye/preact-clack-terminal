import { useState, useEffect, useRef } from 'preact/hooks';
import type { SelectOption } from '../types';

interface Props {
  message: string;
  options: SelectOption[];
  placeholder: string;
  maxItems: number;
  onSubmit: (value: any) => void;
  onCancel: () => void;
}

export function AutocompletePrompt({
  message,
  options,
  placeholder,
  maxItems,
  onSubmit,
  onCancel,
}: Props) {
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState(options);
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const lower = query.toLowerCase();
    setFiltered(
      options.filter((opt) => opt.label.toLowerCase().includes(lower)),
    );
    setActiveIdx(0);
  }, [query, options]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((prev) => (prev + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[activeIdx]) onSubmit(filtered[activeIdx].value);
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div className="clack-prompt clack-autocomplete-prompt">
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
          value={query}
          onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
          onKeyDown={handleKey}
          placeholder={placeholder}
          autoComplete="off"
        />
      </div>
      <div className="clack-options-list">
        {filtered.slice(0, maxItems).map((opt, idx) => (
          <div
            key={idx}
            className={`clack-option ${idx === activeIdx ? 'clack-option-active' : ''} ${opt.disabled ? 'clack-option-disabled' : ''}`}
            onClick={() => !opt.disabled && onSubmit(opt.value)}
            onMouseEnter={() => setActiveIdx(idx)}
          >
            <span className="clack-option-marker">
              {idx === activeIdx ? '▶' : '○'}
            </span>
            <span className="clack-option-label">{opt.label}</span>
            {opt.hint && <span className="clack-option-hint">{opt.hint}</span>}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="clack-option-disabled">No matches</div>
        )}
      </div>
      <div className="clack-prompt-hint">
        <span className="clack-hint-symbol">▲▼</span>
        <span> navigate </span>
        <span className="clack-hint-symbol">⏎</span>
        <span> select </span>
        <span className="clack-hint-symbol">⎋</span>
        <span> cancel</span>
      </div>
    </div>
  );
}
