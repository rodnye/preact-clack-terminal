export interface SelectOption<T = any> {
    value: T;
    label: string;
    disabled?: boolean;
    hint?: string;
}
export interface MultiselectOption<T = any> extends SelectOption<T> {
}
export interface TextOptions<T> {
    message: string;
    placeholder?: string;
    initialValue?: string;
    validate?: (value: T) => string | void | undefined | Promise<string | void | undefined>;
    parser?: (raw: string) => T;
}
export interface ConfirmOptions {
    message: string;
    yesLabel?: string;
    noLabel?: string;
}
export interface GroupOptions {
    onCancel?: (ctx: {
        results: Record<string, any>;
    }) => void;
}
export interface SpinnerInstance {
    start(text: string): this;
    stop(text?: string): this;
    message(text: string): this;
}
export interface Task {
    title: string;
    task: (message: (msg: string) => void) => Promise<string | undefined>;
    status?: 'pending' | 'success' | 'error';
}
export type MessageEntry = {
    type: 'intro' | 'outro' | 'log' | 'error' | 'warn' | 'success' | 'prompt' | 'answer' | 'spinner' | 'raw' | 'task';
    content: string;
    spinnerId?: string;
};
export type PromptData = {
    type: 'text';
    message: string;
    options: TextOptions<any>;
    parser: (raw: string) => any;
    resolve: (v: any) => void;
    reject: (e: Error) => void;
} | {
    type: 'password';
    message: string;
    mask: string;
    validate?: (v: string) => string | void | Promise<string | void>;
    resolve: (v: string) => void;
    reject: (e: Error) => void;
} | {
    type: 'confirm';
    message: string;
    yesLabel: string;
    noLabel: string;
    resolve: (v: boolean) => void;
    reject: (e: Error) => void;
} | {
    type: 'select';
    message: string;
    options: SelectOption[];
    resolve: (v: any) => void;
    reject: (e: Error) => void;
} | {
    type: 'multiselect';
    message: string;
    options: MultiselectOption[];
    required: boolean;
    resolve: (v: any[]) => void;
    reject: (e: Error) => void;
} | {
    type: 'autocomplete';
    message: string;
    options: SelectOption[];
    placeholder: string;
    maxItems: number;
    resolve: (v: any) => void;
    reject: (e: Error) => void;
};
