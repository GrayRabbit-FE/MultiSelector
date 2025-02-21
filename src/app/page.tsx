"use client"
import { useState } from "react";
import { MultiSelectorOptionValue } from "./types/component-types";
import NumberStepper from "./components/number-stepper";
import MultiSelector from "./components/multi-selector";
export default function Demo() {
    const options: MultiSelectorOptionValue[] = [
        { label: "Option 1", value: "option1" },
        { label: "Option 2", value: "option2" },
        { label: "Option 3", value: "option3" },
        { label: "Option 4", value: "option4" },
        { label: "Option 5", value: "option5" },
        { label: "Option 6", value: "option6" },
        { label: "Option 7", value: "option7" },
        { label: "Option 8", value: "option8" },
        { label: "Option 9", value: "option9" },
        { label: "Option 10", value: "option10" },
        // { label: "Option 11", value: "option11" },
    ];

    const [columns, setColumns] = useState(3);
    const [enableSelectAll, setEnableSelectAll] = useState(true);
    //这是一个测试页面，具体代码请看./components ./types以及./hooks目录
    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen py-2">
                <h1 className="text-4xl font-bold mb-4">Code Test Demo</h1>
                <MultiSelector defaultValue={["option1", "option2", "option7"]} onChange={e => console.log(e)} enableSelectAll={enableSelectAll} columns={columns} options={options} />
                <div className="flex flex-row items-center justify-center gap-2 mt-4">
                    <input type="checkbox" checked={enableSelectAll} onChange={(e) => { setEnableSelectAll(e.target.checked) }} /> Enable Select All
                </div>
                <NumberStepper value={columns} max={4} min={1} step={1} onChange={(value) => { setColumns(value) }} />
            </div>
        </>
    );
}
