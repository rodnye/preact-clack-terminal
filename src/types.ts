export interface SelectOption<T = any> {
  label: string;
  value: T;
}

export interface TextPromptOptions<T> {
  placeholder?: string;
  initialValue?: string;
  validate?: (
    value: T,
  ) => string | void | undefined | Promise<string | void | undefined>;
  parser?: (raw: string) => T;
}

export interface ConfirmOptions {
  yesLabel?: string;
  noLabel?: string;
}

export type ValidationResult = string | void | undefined;

export interface MessageEntry {
  type: 'print' | 'system' | 'result';
  content: string;
}

export type PromptData =
  | {
      type: 'select';
      message: string;
      options: SelectOption[];
      resolve: (value: any) => void;
      reject: (err: Error) => void;
    }
  | {
      type: 'text';
      message: string;
      options: TextPromptOptions<any>;
      parser: (raw: string) => any;
      resolve: (value: any) => void;
      reject: (err: Error) => void;
    }
  | {
      type: 'confirm';
      message: string;
      yesLabel: string;
      noLabel: string;
      resolve: (value: boolean) => void;
      reject: (err: Error) => void;
    };

export interface TerminalApi {
  print(text: string): void;
  println(text: string): void;
  select<T>(
    options: { label: string; value: T }[],
    message: string,
  ): Promise<T>;
  int(
    message: string,
    opts?: Omit<TextPromptOptions<number>, 'parser'>,
  ): Promise<number>;
  float(
    message: string,
    opts?: Omit<TextPromptOptions<number>, 'parser'>,
  ): Promise<number>;
  read(
    message: string,
    opts?: Omit<TextPromptOptions<string>, 'parser'>,
  ): Promise<string>;
  confirm(message: string, opts?: ConfirmOptions): Promise<boolean>;
}
