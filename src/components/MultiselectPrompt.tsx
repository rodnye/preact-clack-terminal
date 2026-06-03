import { useState, useEffect, useRef } from 'preact/hooks';
import type { MultiselectOption } from '../types';
import {
  S_SELECT,
  S_CHECKBOX_ACTIVE,
  S_CHECKBOX_SELECTED,
  S_CHECKBOX_INACTIVE,
} from '../common';

interface Props {
  message: string;
  options: MultiselectOption[];
  required: boolean;
  onSubmit: (value: any[]) => void;
  onCancel: () => void;
}

export function MultiselectPrompt({
  message,
  options,
  required,
  onSubmit,
  onCancel,
}: Props) {
  const [selected, setSelected] = useState<Set<any>>(new Set());
  const [activeIdx, setActiveIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const getCheckboxSymbol = (isSelected: boolean, isActive: boolean) => {
    if (isSelected) return S_CHECKBOX_SELECTED;
    if (isActive) return S_CHECKBOX_ACTIVE;
    return S_CHECKBOX_INACTIVE;
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      e.preventDefault();

      if (e.key === 'ArrowDown') {
        setActiveIdx((prev) => (prev + 1) % options.length);
      } else if (e.key === 'ArrowUp') {
        setActiveIdx((prev) => (prev - 1 + options.length) % options.length);
      } else if (e.key === ' ') {
        const opt = options[activeIdx];
        if (!opt.disabled) {
          const newSelected = new Set(selected);
          if (newSelected.has(opt.value)) newSelected.delete(opt.value);
          else newSelected.add(opt.value);
          setSelected(newSelected);
        }
      } else if (e.key === 'Enter') {
        if (!required || selected.size > 0) onSubmit(Array.from(selected));
      } else if (e.key === 'Escape') {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeIdx, options, selected, required, onSubmit, onCancel]);

  useEffect(() => {
    const el = containerRef.current?.querySelector(`[data-idx="${activeIdx}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIdx]);

  return (
    <div className="clack-prompt clack-multiselect-prompt" ref={containerRef}>
      <div className="clack-prompt-message">
        <span className="clack-prompt-symbol">{S_SELECT}</span>
        <span className="clack-prompt-text">{message}</span>
      </div>
      <div className="clack-options-list">
        {options.map((opt, idx) => (
          <div
            key={idx}
            data-idx={idx}
            className={`clack-option ${idx === activeIdx ? 'clack-option-active' : ''} ${opt.disabled ? 'clack-option-disabled' : ''}`}
            onClick={() =>
              !opt.disabled &&
              setSelected((prev) => {
                const newSet = new Set(prev);
                if (newSet.has(opt.value)) newSet.delete(opt.value);
                else newSet.add(opt.value);
                return newSet;
              })
            }
            onMouseEnter={() => setActiveIdx(idx)}
          >
            <span className="clack-option-marker">
              {getCheckboxSymbol(selected.has(opt.value), idx === activeIdx)}
            </span>
            <span className="clack-option-label">{opt.label}</span>
            {opt.hint && idx === activeIdx && (
              <span className="clack-option-hint">{opt.hint}</span>
            )}
          </div>
        ))}
      </div>
      <div className="clack-prompt-hint">
        <span className="clack-hint-symbol">▲▼</span>
        <span> navigate </span>
        <span className="clack-hint-symbol">␣</span>
        <span> toggle </span>
        <span className="clack-hint-symbol">⏎</span>
        <span> submit </span>
        <span className="clack-hint-symbol">⎋</span>
        <span> cancel</span>
      </div>
    </div>
  );
}
