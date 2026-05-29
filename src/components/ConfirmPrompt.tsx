import { useState, useEffect } from 'preact/hooks';

interface Props {
  message: string;
  yesLabel: string;
  noLabel: string;
  onConfirm: (value: boolean) => void;
  onCancel: () => void;
}

export function ConfirmPrompt({
  message,
  yesLabel,
  noLabel,
  onConfirm,
  onCancel,
}: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const options = [
    { label: yesLabel, value: true },
    { label: noLabel, value: false },
  ];

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setActiveIdx(0);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setActiveIdx(1);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        onConfirm(options[activeIdx].value);
      } else if (e.key === 'Escape') {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeIdx, options, onConfirm, onCancel]);

  return (
    <div className="clack-prompt clack-confirm-prompt">
      <div className="clack-prompt-message">
        <span className="clack-prompt-symbol">◈</span>
        <span className="clack-prompt-text">{message}</span>
      </div>
      <div className="clack-confirm-options">
        {options.map((opt, idx) => (
          <button
            key={idx}
            className={`clack-confirm-btn ${idx === activeIdx ? 'clack-confirm-active' : ''}`}
            onClick={() => onConfirm(opt.value)}
            onMouseEnter={() => setActiveIdx(idx)}
          >
            <span className="clack-confirm-marker">
              {idx === activeIdx ? '▶' : '●'}
            </span>
            {opt.label}
          </button>
        ))}
      </div>
      <div className="clack-prompt-hint">
        <span className="clack-hint-symbol">◀ ▶</span>
        <span> choose </span>
        <span className="clack-hint-symbol">⏎</span>
        <span> confirm </span>
      </div>
    </div>
  );
}
