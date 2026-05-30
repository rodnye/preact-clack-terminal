import { SelectOption } from '../types';
interface Props {
    message: string;
    options: SelectOption[];
    onSelect: (value: any) => void;
    onCancel: () => void;
}
export declare function SelectPrompt({ message, options, onSelect, onCancel }: Props): import("preact").JSX.Element;
export {};
