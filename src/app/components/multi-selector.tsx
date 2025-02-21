import { FC, useEffect, useState } from "react";
import { MultiSelectorOptionProps, MultiSelectorOptionValue, MultiSelectorProps } from "../types/component-types";
import useControllableValue from "../hooks/use-controllable-value";

const MultiSelectorOption: FC<MultiSelectorOptionProps> = (props) => {
    const { label, value, onCheckedChange = () => { }, checked = false } = props;
    return (
        <div>
            <input
                type="checkbox"
                value={value}
                checked={checked}
                onChange={(e) => onCheckedChange(e.target.checked, { label, value: value })} />
            <label>{label}</label>
        </div>
    )
}
const MultiSelector: FC<MultiSelectorProps> = (props) => {
    const { value, options, defaultValue = [], columns = 3, onChange = () => { }, enableSelectAll = false } = props;
    //合法化检查
    const validValue = (value: any) => {
        if (!value?.length) return undefined;
        for (let i = 0; i < value.length; i++) {
            if (typeof value[i] !== 'string') {
                return undefined;
            }
        }
        return value;
    }
    //看有没有默认值，如果有，则用默认值，如果没有，则置为空数组，实现了一个可以将组件变为可受控组件的hook, 代码在./hooks/use-controllable-value.tsx
    const { state, setState } = useControllableValue<string[]>({ value: validValue(value), onChange, defaultValue });
    //处理选项变化
    const handleOptionChange = (checked: boolean, option: MultiSelectorOptionValue) => {
        if (checked) {
            setState([option.value, ...state]);
        } else {
            setState(state.filter((item) => item !== option.value));
        }
    }
    //要让选项尽可能的均匀分布，需要计算每列有多少个选项才能均匀分布。为了竖向分布，从1-最后一个元素依次截取并分配到每列即可
    //如果有enableSelectAll，则需要在最前面添加一个选项，那么第一个数组要少一个元素，其他的依次后移
    function calculateColumns(options: MultiSelectorOptionValue[], columns: number, enableSelectAll = false): MultiSelectorOptionValue[][] {
        const totalOptions = options.length;
        const selectAllGap = enableSelectAll ? 1 : 0;
        //计算每列至少有多少个选项，并考虑全选选项，并且每列最多只差一个选项
        const itemsPerColumn = Math.floor((totalOptions + selectAllGap) / columns);
        //计算有多少列要多一个选项
        const extraColumn = (totalOptions + selectAllGap) % columns;
        const renderItems = Array.from({ length: columns }, (_, i) => {
            //计算每列的起始，并注意加上每列之前已经多加的选项（每列最多一个也就是i，最大值就是extraColumn）
            const start = i * itemsPerColumn + (i < extraColumn ? i : extraColumn);
            //计算每列的结束, 只要知道这列有几个选项，然后从起始位置开始加即可
            const end = Math.min(start + itemsPerColumn, totalOptions) + (i < extraColumn ? 1 : 0);
            //第一列和最后一列需要特殊处理，因为全选选项会占用一个位置，所以要少截取一个，
            //但在逻辑上，因为之前已经考虑全选的存在，所以逻辑上还是正常长度。而最后一列必须到结尾为止。其他的正常截取即可
            if (i === 0) {
                //只有一列的时候不能特殊处理，否则最后一个就没了
                const realGap = columns > 1 ? selectAllGap : 0;
                return options.slice(start, end - realGap);
            } else if (i === columns - 1) {
                return options.slice(start - selectAllGap, end);
            } else {
                return options.slice(start - selectAllGap, end - selectAllGap);
            }
        });
        return renderItems;
    }


    const renderItems = calculateColumns(options, columns, enableSelectAll);


    return (

        <div className={`flex flex-row items-start  justify-center gap-4`}>
            {
                renderItems.map((item, index) => {
                    return (
                        <div className="flex flex-col items-center justify-center gap-4" key={index}>
                            {
                                //第一列，并且有enableSelectAll，则添加一个全选选项
                                index === 0 && enableSelectAll &&
                                <MultiSelectorOption
                                    label="Select All"
                                    value="selectAll"
                                    checked={state.length === options.length}
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            setState(options.map((option) => option.value));
                                        } else {
                                            setState([]);
                                        }
                                    }} />
                            }
                            {
                                //每列其他选项
                                item.map((option) => {
                                    return (
                                        <MultiSelectorOption
                                            key={option.value}
                                            label={option.label}
                                            value={option.value}
                                            checked={state.includes(option.value)}
                                            onCheckedChange={handleOptionChange} />
                                    )
                                })
                            }
                        </div>
                    )
                })

            }
        </div>
    )
}


export default MultiSelector;