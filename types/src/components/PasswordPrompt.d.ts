interface Props {
    message: string;
    mask?: string;
    validate?: (v: string) => string | void | Promise<string | void>;
    onSubmit: (value: string) => void;
    onCancel: () => void;
}
export declare function PasswordPrompt({ message, validate, mask, onSubmit, onCancel, }: Props): import("preact").JSX.Element;
export {};
