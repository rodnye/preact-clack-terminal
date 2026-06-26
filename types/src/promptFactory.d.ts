import { SelectOption, MultiselectOption, TextOptions, ConfirmOptions } from './types';
export declare function createTextPrompt<T>(options: TextOptions<T>, extras: {
    parser: (raw: string) => T;
}): Promise<T>;
export declare function createPasswordPrompt(options: {
    message: string;
    mask?: string;
    validate?: (v: string) => string | void | Promise<string | void>;
}): Promise<string>;
export declare function createConfirmPrompt(options: ConfirmOptions): Promise<boolean>;
export declare function createSelectPrompt<T>(options: {
    message: string;
    options: SelectOption<T>[];
}): Promise<T>;
export declare function createMultiselectPrompt<T>(options: {
    message: string;
    options: MultiselectOption<T>[];
    required?: boolean;
}): Promise<T[]>;
export declare function createAutocompletePrompt<T>(options: {
    message: string;
    options: SelectOption<T>[];
    placeholder?: string;
    maxItems?: number;
}): Promise<T>;
export declare function createGroupPrompts<G extends Record<string, () => Promise<any>>>(prompts: G, opts?: {
    onCancel?: (ctx: {
        results: Record<string, any>;
    }) => void;
}): Promise<{
    [K in keyof G]: Awaited<ReturnType<G[K]>>;
}>;
