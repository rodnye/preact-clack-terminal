import { TextOptions } from '../types';
interface Props<T> {
    message: string;
    options: TextOptions<T>;
    parser: (raw: string) => T;
    onSubmit: (value: T) => void;
    onCancel: () => void;
}
export declare function TextPrompt<T>({ message, options, parser, onSubmit, onCancel, }: Props<T>): import("preact").JSX.Element;
export {};
