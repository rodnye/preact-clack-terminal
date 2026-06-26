import { SelectOption } from '../types';
interface Props {
    message: string;
    options: SelectOption[];
    placeholder: string;
    maxItems: number;
    onSubmit: (value: any) => void;
    onCancel: () => void;
}
export declare function AutocompletePrompt({ message, options, placeholder, maxItems, onSubmit, onCancel, }: Props): import("preact").JSX.Element;
export {};
