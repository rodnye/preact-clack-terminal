import { useState, useEffect, useRef } from 'preact/hooks';
import type { SelectOption } from '../types';

interface Props {
  message: string;
  options: SelectOption[];
  onSelect: (value: any) => void;
  onCancel: () => void;
}

export function SelectPrompt({ message, options, onSelect, onCancel }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIdx((prev) => (prev + 1) % options.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIdx((prev) => (prev - 1 + options.length) % options.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        onSelect(options[activeIdx].value);
      } else if (e.key === 'Escape') {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [options, activeIdx, onSelect, onCancel]);

  useEffect(() => {
    const activeElement = containerRef.current?.querySelector(
      `[data-idx="${activeIdx}"]`,
    );
    activeElement?.scrollIntoView({ block: 'nearest' });
  }, [activeIdx]);

  return (
    <div className="clack-prompt clack-select-prompt" ref={containerRef}>
      <div className="clack-prompt-message">
        <span className="clack-prompt-symbol">◇</span>
        <span className="clack-prompt-text">{message}</span>
      </div>
      <div className="clack-options-list">
        {options.map((opt, idx) => (
          <div
            key={idx}
            data-idx={idx}
            className={`clack-option ${idx === activeIdx ? 'clack-option-active' : ''}`}
            onClick={() => onSelect(opt.value)}
            onMouseEnter={() => setActiveIdx(idx)}
          >
            <span className="clack-option-marker">
              {idx === activeIdx ? '▶' : '○'}
            </span>
            <span className="clack-option-label">{opt.label}</span>
          </div>
        ))}
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
