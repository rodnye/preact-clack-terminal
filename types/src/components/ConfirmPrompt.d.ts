interface Props {
    message: string;
    yesLabel: string;
    noLabel: string;
    onConfirm: (value: boolean) => void;
    onCancel: () => void;
}
export declare function ConfirmPrompt({ message, yesLabel, noLabel, onConfirm, onCancel, }: Props): import("preact").JSX.Element;
export {};
