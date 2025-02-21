"use client"
import { FC, useState } from "react";
type MultiSelectorOption = {
  label: string;
  value: string;
}
type MultiSelectorProps = {
  options: MultiSelectorOption[];
  defaultValue?: string[];
  enableSelectAll?: boolean;
  columns?: number;
  onChange?: (selected: string[]) => void;
}
type MultiSelectorOptionProps = {
  label: string;
  value: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean, option: MultiSelectorOption) => void;
}
const MultiSelectorOption: FC<MultiSelectorOptionProps> = (props) => {
  const { label, value, onCheckedChange = () => { }, checked = false} = props;
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
  const { options, defaultValue, columns = 3, onChange = () => { }, enableSelectAll = false } = props;
  //看有没有默认值，如果有，则用默认值，如果没有，则置为空
  // if(!(defaultValue instanceof Array)){

  // }
  const [selectedOptions, setSelectedOptions] = useState<string[]>(defaultValue || []);
  const handleOptionChange = (checked: boolean, option: MultiSelectorOption) => {
    if (checked) {
      setSelectedOptions([option.value, ...selectedOptions]);
      onChange([option.value, ...selectedOptions]);
    } else {
      setSelectedOptions(selectedOptions.filter((item) => item !== option.value));
      onChange(selectedOptions.filter((item) => item !== option.value));
    }
  }
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4"></h1>
      <div className="flex flex-row items-center justify-center">
        {
          enableSelectAll && <MultiSelectorOption
            label="Select All"
            value="selectAll"
            checked = {selectedOptions.length === options.length}
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
          options.map((option) => {
            return (
                <MultiSelectorOption
                  label={option.label}
                  value={option.value}
                  checked={selectedOptions.includes(option.value)}
                  onCheckedChange={handleOptionChange} />
              )
          })
        }
      </div>
    </div>
  )
}
export default function Demo() {
  const options: MultiSelectorOption[] = [
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" },
    { label: "Option 3", value: "option3" },
  ]
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-4xl font-bold mb-4">MultiSelector Demo</h1>
        <MultiSelector enableSelectAll options={options} onChange={(options) => { console.log(options) }} />
      </div>
    </>
  );
}
