import { h, render } from 'preact';
import { TerminalComponent } from './components/Terminal';
import type { ConfirmOptions, TerminalApi, TextPromptOptions } from './types';
import { messagesStore } from './store';
import {
  createSelectPrompt,
  createTextPrompt,
  createConfirmPrompt,
} from './promptFactory';

export class ClackTerminal implements TerminalApi {
  private static instances = new WeakMap<Element, ClackTerminal>();

  private constructor(container: Element) {
    render(h(TerminalComponent, null), container);
  }

  static init(selector: string): ClackTerminal {
    const container = document.querySelector(selector);
    if (!container) throw new Error(`Element ${selector} not found`);
    if (ClackTerminal.instances.has(container)) {
      return ClackTerminal.instances.get(container)!;
    }
    const instance = new ClackTerminal(container);
    ClackTerminal.instances.set(container, instance);
    return instance;
  }

  print(text: string): void {
    const current = messagesStore.get();
    messagesStore.set([...current, { type: 'print', content: text }]);
  }

  println(text: string): void {
    this.print(text);
  }

  async select<T>(
    options: { label: string; value: T }[],
    message: string,
  ): Promise<T> {
    return createSelectPrompt<T>(options, message);
  }

  async int(
    message: string,
    opts?: Omit<TextPromptOptions<number>, 'parser'>,
  ): Promise<number> {
    return createTextPrompt<number>(message, {
      ...opts,
      parser: (val) => {
        const num = Number.parseInt(val, 10);
        if (isNaN(num)) throw new Error('Must be a valid integer');
        return num;
      },
    });
  }

  async float(
    message: string,
    opts?: Omit<TextPromptOptions<number>, 'parser'>,
  ): Promise<number> {
    return createTextPrompt<number>(message, {
      ...opts,
      parser: (val) => {
        const num = Number.parseFloat(val);
        if (isNaN(num)) throw new Error('Must be a valid number');
        return num;
      },
    });
  }

  async read(
    message: string,
    opts?: Omit<TextPromptOptions<string>, 'parser'>,
  ): Promise<string> {
    return createTextPrompt<string>(message, {
      ...opts,
      parser: (val) => val,
    });
  }

  async confirm(message: string, opts?: ConfirmOptions): Promise<boolean> {
    return createConfirmPrompt(message, opts);
  }
}
