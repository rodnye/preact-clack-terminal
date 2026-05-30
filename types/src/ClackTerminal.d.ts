import { ConfirmOptions, GroupOptions, MultiselectOption, SelectOption, SpinnerInstance, Task, TextOptions } from './types';
interface InitOptions {
    header?: boolean;
}
export declare class ClackTerminal {
    private static instances;
    private constructor();
    static init(selector: string | HTMLElement, options?: InitOptions): ClackTerminal;
    private addMessage;
    intro(text: string): void;
    outro(text: string): void;
    log: ((msg: string, opts?: {
        symbol?: string;
    }) => void) & {
        info: (msg: string) => void;
        success: (msg: string) => void;
        step: (msg: string) => void;
        warn: (msg: string) => void;
        error: (msg: string) => void;
        message: (msg: string, opts?: {
            symbol?: string;
        }) => void;
    };
    text(options: TextOptions<string>): Promise<string>;
    password(options: Omit<TextOptions<string>, 'placeholder'> & {
        mask?: string;
    }): Promise<string>;
    confirm(options: ConfirmOptions): Promise<boolean>;
    select<T = string>(options: {
        message: string;
        options: SelectOption<T>[];
    }): Promise<T>;
    multiselect<T = string>(options: {
        message: string;
        options: MultiselectOption<T>[];
        required?: boolean;
    }): Promise<T[]>;
    autocomplete<T = string>(options: {
        message: string;
        options: SelectOption<T>[];
        placeholder?: string;
        maxItems?: number;
    }): Promise<T>;
    group<G extends Record<string, () => Promise<any>>>(prompts: G, opts?: GroupOptions): Promise<{
        [K in keyof G]: Awaited<ReturnType<G[K]>>;
    }>;
    spinner(): SpinnerInstance;
    tasks(tasksList: Task[]): Promise<void>;
}
export {};
