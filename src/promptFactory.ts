import { promptStore } from './store';
import type { SelectOption, TextPromptOptions, ConfirmOptions } from './types';

export function createSelectPrompt<T>(
  options: SelectOption<T>[],
  message: string,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    promptStore.set({
      type: 'select',
      message,
      options: options.map((opt) => ({ label: opt.label, value: opt.value })),
      resolve: (val: T) => {
        promptStore.set(null);
        resolve(val);
        addResultMessage(`${message} → ${String(val)}`);
      },
      reject: (err: Error) => {
        promptStore.set(null);
        reject(err);
      },
    });
  });
}

export function createTextPrompt<T>(
  message: string,
  opts: TextPromptOptions<T> & { parser: (raw: string) => T },
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    promptStore.set({
      type: 'text',
      message,
      options: {
        placeholder: opts.placeholder,
        initialValue: opts.initialValue,
        validate: opts.validate,
      },
      parser: opts.parser,
      resolve: (val: T) => {
        promptStore.set(null);
        resolve(val);
        addResultMessage(`${message} → ${String(val)}`);
      },
      reject: (err: Error) => {
        promptStore.set(null);
        reject(err);
      },
    });
  });
}

export function createConfirmPrompt(
  message: string,
  opts?: ConfirmOptions,
): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    promptStore.set({
      type: 'confirm',
      message,
      yesLabel: opts?.yesLabel ?? 'Yes',
      noLabel: opts?.noLabel ?? 'No',
      resolve: (val: boolean) => {
        promptStore.set(null);
        resolve(val);
        addResultMessage(`${message} → ${val ? 'Yes' : 'No'}`);
      },
      reject: (err: Error) => {
        promptStore.set(null);
        reject(err);
      },
    });
  });
}

function addResultMessage(content: string) {
  import('./store').then(({ messagesStore }) => {
    const current = messagesStore.get();
    messagesStore.set([...current, { type: 'result', content }]);
  });
}
