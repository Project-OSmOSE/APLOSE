export type FormProps<Data, InputData extends Record<string, any>> = {
    input?: Partial<InputData>;
    onCreate?: (data: Data) => void;
}
