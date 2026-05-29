import type { PromptData } from '../types';
import { SelectPrompt } from './SelectPrompt';
import { TextPrompt } from './TextPrompt';
import { ConfirmPrompt } from './ConfirmPrompt';

interface Props {
  activePrompt: PromptData | null;
}

export function PromptArea({ activePrompt }: Props) {
  if (!activePrompt) {
    return (
      <div className="clack-prompt-area clack-idle">
        <div className="clack-prompt-idle">
          <span className="clack-prompt-symbol">◀</span>
          <span className="clack-prompt-wait">awaiting command</span>
          <span className="clack-prompt-symbol">▶</span>
        </div>
      </div>
    );
  }

  if (activePrompt.type === 'select') {
    return (
      <SelectPrompt
        message={activePrompt.message}
        options={activePrompt.options}
        onSelect={(val) => activePrompt.resolve(val)}
        onCancel={() => activePrompt.reject(new Error('Prompt cancelled'))}
      />
    );
  }

  if (activePrompt.type === 'text') {
    return (
      <TextPrompt
        message={activePrompt.message}
        options={activePrompt.options}
        parser={activePrompt.parser}
        onSubmit={(val) => activePrompt.resolve(val)}
        onCancel={() => activePrompt.reject(new Error('Prompt cancelled'))}
      />
    );
  }

  if (activePrompt.type === 'confirm') {
    return (
      <ConfirmPrompt
        message={activePrompt.message}
        yesLabel={activePrompt.yesLabel}
        noLabel={activePrompt.noLabel}
        onConfirm={(val) => activePrompt.resolve(val)}
        onCancel={() => activePrompt.reject(new Error('Prompt cancelled'))}
      />
    );
  }

  return null;
}
