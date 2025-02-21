import { FC, useEffect, useState } from "react";
import { NumberStepperProps } from "../types/component-types";
import useControllableValue from "../hooks/use-controllable-value";

const NumberStepper: FC<NumberStepperProps> = (props) => {
    const { value, max, min = 0, step = 1, defaultValue = min, onChange = () => { } } = props;
    const validPassInput = (newValue: number) => {
        if (typeof max === "number" && newValue > max) {
            return max;
        }
        if (typeof min === "number" && newValue < min) {
            return min;
        }
        return newValue;
    }

    const {state, setState} = useControllableValue({value, defaultValue, onChange});

    
    return (
        <div className="flex flex-row items-center justify-center gap-2 text-black">
            <button onClick={() => setState(validPassInput(state - step))} className="bg-gray-200 rounded-md px-2 py-1">-</button>
            <div className="bg-gray-200 rounded-md px-2 py-1">{state}</div>
            <button onClick={() => setState(validPassInput(state + step))} className="bg-gray-200 rounded-md px-2 py-1">+</button>
        </div>
    )
}


export default NumberStepper;