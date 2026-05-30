import { MultiselectOption } from '../types';
interface Props {
    message: string;
    options: MultiselectOption[];
    required: boolean;
    onSubmit: (value: any[]) => void;
    onCancel: () => void;
}
export declare function MultiselectPrompt({ message, options, required, onSubmit, onCancel, }: Props): import("preact").JSX.Element;
export {};
