type MultiSelectorOptionValue = {
    label: string;
    value: string;
}
type MultiSelectorProps = {
    options: MultiSelectorOptionValue[];
    defaultValue?: string[];
    enableSelectAll?: boolean;
    columns?: number;
    value?: string[];
    onChange?: (selected: string[]) => void;
}
type MultiSelectorOptionProps = {
    label: string;
    value: string;
    checked?: boolean;
    onCheckedChange?: (checked: boolean, option: MultiSelectorOptionValue) => void;
}

type NumberStepperProps = {
    defaultValue?: number,
    value?: number,
    max?: number,
    min?: number,
    step?: number,
    onChange?: (value: number) => void,
}

export type { MultiSelectorOptionValue, MultiSelectorProps, MultiSelectorOptionProps, NumberStepperProps };