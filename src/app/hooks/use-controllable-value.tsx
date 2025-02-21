import { useMemo, useState } from "react";

export type Props = Record<string, any>;

function useControllableValue<T = any>(props: Props): { state: T, setState: (value: T) => void } {
    const { value, defaultValue, onChange } = props;

    const isControlled = value !== undefined;
    const initValue = useMemo(() => {
        if (isControlled) {
            return value;
        }
        return defaultValue;
    }, []);

    const [state, setState] = useState<T>(initValue);
    const handleChange = (newValue: T) => {
        //不是受控组件，自己维护state
        //是受控组件，只需要通过onChange事件抛出最新值即可，不要维护自己的state
        if (!isControlled) {
            setState(newValue);
        }
        onChange(newValue);
    }

    return {
        state: value !== undefined ? value : state,
        setState: handleChange,
    }
};

export default useControllableValue;