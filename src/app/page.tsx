"use client"
import { FC, Fragment, useEffect, useState } from "react";
type MultiSelectorOption = {
  label: string;
  value: string;
}
type MultiSelectorProps = {
  options: MultiSelectorOption[];
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
  onCheckedChange?: (checked: boolean, option: MultiSelectorOption) => void;
}
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
  //看有没有默认值，如果有，则用默认值，如果没有，则置为空数组
  const [selectedOptions, setSelectedOptions] = useState<string[]>(value || defaultValue);
  const validPassInput = (value: any) => {
    if(!value.length) return [];
    for(let i = 0; i < value.length; i++) {
      if(typeof value[i] !== 'string') {
        return [];
      }
    }
    return value;
  }
  useEffect(() => {
    setSelectedOptions(validPassInput(value));
  }, [value])
  //处理选项变化
  const handleOptionChange = (checked: boolean, option: MultiSelectorOption) => {
    if (checked) {
      setSelectedOptions([option.value, ...selectedOptions]);
      onChange([option.value, ...selectedOptions]);
    } else {
      setSelectedOptions(selectedOptions.filter((item) => item !== option.value));
      onChange(selectedOptions.filter((item) => item !== option.value));
    }
  }
  //要让选项尽可能的均匀分布，需要计算每列有多少个选项才能均匀分布。为了竖向分布，从1-最后一个元素依次截取并分配到每列即可
  //如果有enableSelectAll，则需要在最前面添加一个选项，那么第一个数组要少一个元素，其他的依次后移
  function calculateColumns(options: MultiSelectorOption[], columns: number, enableSelectAll = false): MultiSelectorOption[][] {
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
                    checked={selectedOptions.length === options.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedOptions(options.map((option) => option.value));
                        onChange(options.map((option) => option.value));
                      } else {
                        setSelectedOptions([]);
                        onChange([]);
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
                        checked={selectedOptions.includes(option.value)}
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
type NumberStepperProps = {
  defaultValue?: number,
  value?: number,
  max?: number,
  min?: number,
  step?: number,
  onChange?: (value: number) => void,
}
const NumberStepper: FC<NumberStepperProps> = (props) => {
  const { value = 0, max, min = 0, step = 1, defaultValue = min, onChange = () => { } } = props;
  const [inputValue, setInputValue] = useState(typeof value === "number" ? value : defaultValue);
  //当value变化时，检查是否合法，不合法则返回默认值
  const validPassInput = (newValue: number) => {
    if (typeof max === "number" && newValue > max) {
      return max;
    }
    if (typeof min === "number" && newValue < min) {
      return min;
    }
    return newValue;
  }
  useEffect(() => {
    setInputValue(validPassInput(value));
  }, [value]);
  const handleChange = (newValue: number) => {
    setInputValue(validPassInput(newValue));
    onChange(validPassInput(newValue));
  }
  return (
    <div className="flex flex-row items-center justify-center gap-2 text-black">
      <button onClick={() => handleChange(inputValue - step)} className="bg-gray-200 rounded-md px-2 py-1">-</button>
      <div className="bg-gray-200 rounded-md px-2 py-1">{inputValue}</div>
      <button onClick={() => handleChange(inputValue + step)} className="bg-gray-200 rounded-md px-2 py-1">+</button>
    </div>
  )
}

export default function Demo() {
  const options: MultiSelectorOption[] = [
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
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-4xl font-bold mb-4">Code Test Demo</h1>
        <MultiSelector enableSelectAll={enableSelectAll} columns={columns} options={options} onChange={(options) => { console.log(options) }} />
        <div className="flex flex-row items-center justify-center gap-2 mt-4">
          <input type="checkbox" checked={enableSelectAll} onChange={(e) => { setEnableSelectAll(e.target.checked) }} /> Enable Select All
        </div>
        <NumberStepper value={columns} max={4} min={1} step={1} onChange={(value) => { setColumns(value) }} />
      </div>
    </>
  );
}
