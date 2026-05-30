import { messagesStore, promptStore } from './store';
import type {
  SelectOption,
  MultiselectOption,
  TextOptions,
  ConfirmOptions,
} from './types';

function addResultMessage(content: string) {
  messagesStore.set([...messagesStore.get(), { type: 'result', content }]);
}

export function createTextPrompt<T>(
  options: TextOptions<T>,
  extras: { parser: (raw: string) => T },
): Promise<T> {
  return new Promise((resolve, reject) => {
    promptStore.set({
      type: 'text',
      message: options.message,
      options,
      parser: extras.parser,
      resolve: (val: T) => {
        addResultMessage(`${options.message} → ${String(val)}`);
        promptStore.set(null);
        resolve(val);
      },
      reject,
    });
  });
}

export function createPasswordPrompt(options: {
  message: string;
  mask?: string;
  validate?: (v: string) => string | void | Promise<string | void>;
}): Promise<string> {
  return new Promise((resolve, reject) => {
    promptStore.set({
      type: 'password',
      message: options.message,
      mask: options.mask ?? '*',
      validate: options.validate,
      resolve: (val: string) => {
        addResultMessage(`${options.message} → ${'*'.repeat(val.length)}`);
        promptStore.set(null);
        resolve(val);
      },
      reject,
    });
  });
}

export function createConfirmPrompt(options: ConfirmOptions): Promise<boolean> {
  return new Promise((resolve, reject) => {
    promptStore.set({
      type: 'confirm',
      message: options.message,
      yesLabel: options.yesLabel ?? 'Yes',
      noLabel: options.noLabel ?? 'No',
      resolve: (val: boolean) => {
        addResultMessage(`${options.message} → ${val ? 'Yes' : 'No'}`);
        promptStore.set(null);
        resolve(val);
      },
      reject,
    });
  });
}

export function createSelectPrompt<T>(options: {
  message: string;
  options: SelectOption<T>[];
}): Promise<T> {
  return new Promise((resolve, reject) => {
    promptStore.set({
      type: 'select',
      message: options.message,
      options: options.options,
      resolve: (val: T) => {
        addResultMessage(`${options.message} → ${String(val)}`);
        promptStore.set(null);
        resolve(val);
      },
      reject,
    });
  });
}

export function createMultiselectPrompt<T>(options: {
  message: string;
  options: MultiselectOption<T>[];
  required?: boolean;
}): Promise<T[]> {
  return new Promise((resolve, reject) => {
    promptStore.set({
      type: 'multiselect',
      message: options.message,
      options: options.options,
      required: options.required ?? false,
      resolve: (val: T[]) => {
        addResultMessage(
          `${options.message} → ${val.map((v) => String(v)).join(', ')}`,
        );
        promptStore.set(null);
        resolve(val);
      },
      reject,
    });
  });
}

export function createAutocompletePrompt<T>(options: {
  message: string;
  options: SelectOption<T>[];
  placeholder?: string;
  maxItems?: number;
}): Promise<T> {
  return new Promise((resolve, reject) => {
    promptStore.set({
      type: 'autocomplete',
      message: options.message,
      options: options.options,
      placeholder: options.placeholder ?? 'Type to search...',
      maxItems: options.maxItems ?? 5,
      resolve: (val: T) => {
        addResultMessage(`${options.message} → ${String(val)}`);
        promptStore.set(null);
        resolve(val);
      },
      reject,
    });
  });
}

export async function createGroupPrompts<
  G extends Record<string, () => Promise<any>>,
>(
  prompts: G,
  opts?: { onCancel?: (ctx: { results: Record<string, any> }) => void },
): Promise<{ [K in keyof G]: Awaited<ReturnType<G[K]>> }> {
  const results: any = {};
  for (const [key, promptFn] of Object.entries(prompts)) {
    try {
      results[key] = await promptFn();
    } catch (err) {
      if (opts?.onCancel) opts.onCancel({ results });
      throw err;
    }
  }
  return results;
}
