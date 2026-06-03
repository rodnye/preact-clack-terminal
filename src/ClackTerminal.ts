import { h, render } from 'preact';
import { TerminalComponent } from './components/Terminal';
import type {
  ConfirmOptions,
  GroupOptions,
  MessageEntry,
  MultiselectOption,
  SelectOption,
  SpinnerInstance,
  Task,
  TextOptions,
} from './types';
import { messagesStore, spinnerStore, tasksStore } from './store';
import {
  createTextPrompt,
  createPasswordPrompt,
  createConfirmPrompt,
  createSelectPrompt,
  createMultiselectPrompt,
  createAutocompletePrompt,
  createGroupPrompts,
} from './promptFactory';
import {
  S_SUCCESS,
  S_INFO,
  S_WARN,
  S_ERROR,
  S_STEP_ACTIVE,
  S_STEP_SUBMIT,
  S_BAR_START,
  S_BAR_END,
} from './common';

interface InitOptions {
  header?: boolean;
}

export class ClackTerminal {
  private static instances = new WeakMap<Element, ClackTerminal>();

  private constructor(container: Element, options?: InitOptions) {
    render(
      h(TerminalComponent, { header: options?.header ?? true }),
      container,
    );
  }

  static init(
    selector: string | HTMLElement,
    options?: InitOptions,
  ): ClackTerminal {
    const container =
      typeof selector === 'string'
        ? document.querySelector(selector)
        : selector;
    if (!container) throw new Error(`Element ${selector} not found`);
    if (ClackTerminal.instances.has(container))
      return ClackTerminal.instances.get(container)!;
    const instance = new ClackTerminal(container, options);

    ClackTerminal.instances.set(container, instance);

    return instance;
  }

  // Core output methods
  private addMessage(content: string, type: MessageEntry['type'] = 'log') {
    messagesStore.set([...messagesStore.get(), { type, content }]);
  }

  intro(text: string) {
    this.addMessage(`${text}`, 'intro');
  }

  outro(text: string) {
    this.addMessage(`${text}`, 'outro');
  }

  // Log utilities
  log = (() => {
    const returns = (msg: string, opts: { symbol?: string } = {}) =>
      this.addMessage(
        `${opts.symbol ? opts.symbol + ' ' : ''}${msg}`,
        opts.symbol ? 'raw' : 'log',
      );

    const props = {
      info: (msg: string) => this.addMessage(msg, 'log'),
      success: (msg: string) => this.addMessage(msg, 'success'),
      step: (msg: string) => this.addMessage(msg, 'log'),
      warn: (msg: string) => this.addMessage(msg, 'warn'),
      error: (msg: string) => this.addMessage(msg, 'error'),
      message: returns,
    };
    Object.assign(returns, props);

    return returns as typeof returns & typeof props;
  })();

  // Prompt components
  async text(options: TextOptions<string>): Promise<string> {
    return createTextPrompt<string>(options, { parser: (v) => v });
  }

  async password(
    options: Omit<TextOptions<string>, 'placeholder'> & { mask?: string },
  ): Promise<string> {
    return createPasswordPrompt(options);
  }

  async confirm(options: ConfirmOptions): Promise<boolean> {
    return createConfirmPrompt(options);
  }

  async select<T = string>(options: {
    message: string;
    options: SelectOption<T>[];
  }): Promise<T> {
    return createSelectPrompt<T>(options);
  }

  async multiselect<T = string>(options: {
    message: string;
    options: MultiselectOption<T>[];
    required?: boolean;
  }): Promise<T[]> {
    return createMultiselectPrompt<T>(options);
  }

  async autocomplete<T = string>(options: {
    message: string;
    options: SelectOption<T>[];
    placeholder?: string;
    maxItems?: number;
  }): Promise<T> {
    return createAutocompletePrompt<T>(options);
  }

  // Group prompts
  async group<G extends Record<string, () => Promise<any>>>(
    prompts: G,
    opts?: GroupOptions,
  ): Promise<{ [K in keyof G]: Awaited<ReturnType<G[K]>> }> {
    return createGroupPrompts(prompts, opts);
  }

  // Spinner
  spinner(): SpinnerInstance {
    const id = crypto.randomUUID?.() ?? Math.random().toString(36);
    let currentText = '';
    let stopped = false;
    const that = this;

    const update = () => {
      if (stopped) return;
      spinnerStore.set({ id, text: currentText, active: true });
    };

    return {
      start: function (text: string) {
        currentText = text;
        update();
        return this;
      },
      stop: function (text?: string) {
        stopped = true;
        spinnerStore.set({ id, text: text ?? currentText, active: false });
        if (text) that.log.success(text);
        else that.log.success(currentText);
        return this;
      },
      message: function (text: string) {
        if (!stopped) {
          currentText = text;
          update();
        }
        return this;
      },
    };
  }

  // Tasks (sequential)
  async tasks(tasksList: Task[]): Promise<void> {
    tasksStore.set(tasksList);
    for (let i = 0; i < tasksList.length; i++) {
      const task = tasksList[i];
      const spinner = this.spinner();
      spinner.start(task.title);
      try {
        const result = await task.task((msg: string) => spinner.message(msg));
        spinner.stop(result);
        tasksStore.set(
          tasksList.map((t, idx) =>
            idx === i ? { ...t, status: 'success' } : t,
          ),
        );
      } catch (err) {
        spinner.stop(`Failed: ${err}`);
        tasksStore.set(
          tasksList.map((t, idx) =>
            idx === i ? { ...t, status: 'error' } : t,
          ),
        );
        throw err;
      }
    }
    tasksStore.set([]);
  }
}
