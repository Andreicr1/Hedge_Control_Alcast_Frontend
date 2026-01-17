import { InputHTMLAttributes } from 'react';

interface FioriRadioOption {
  value: string;
  label: string;
}

interface FioriRadioGroupProps {
  label?: string;
  options: FioriRadioOption[];
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  horizontal?: boolean;
}

export function FioriRadioGroup({ 
  label, 
  options, 
  name, 
  value, 
  onChange, 
  error,
  horizontal = true 
}: FioriRadioGroupProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="font-['72:Regular',sans-serif] text-[14px] text-[var(--sapContent_LabelColor,#556b82)] leading-[normal]">
          {label}
        </label>
      )}
      <div className={`flex ${horizontal ? 'flex-row gap-4' : 'flex-col gap-2'}`}>
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange?.(e.target.value)}
              className="
                appearance-none
                w-[14px] h-[14px]
                border-2 border-[var(--sapField_BorderColor,#89919a)]
                rounded-full
                cursor-pointer
                relative
                transition-all
                hover:border-[var(--sapField_Hover_BorderColor,#0064d9)]
                focus:outline-none
                focus:border-[var(--sapField_Focus_BorderColor,#0064d9)]
                focus:shadow-[0_0_0_1px_var(--sapField_Focus_BorderColor,#0064d9)]
                checked:border-[var(--sapButton_TextColor,#0064d9)]
                checked:border-[6px]
                disabled:bg-[var(--sapField_ReadOnly_Background,#f7f7f7)]
                disabled:border-[var(--sapField_ReadOnly_BorderColor,#d9d9d9)]
                disabled:cursor-not-allowed
              "
            />
            <span className="font-['72:Regular',sans-serif] text-[14px] text-[var(--sapContent_ForegroundTextColor,#131e29)] leading-[normal] select-none">
              {option.label}
            </span>
          </label>
        ))}
      </div>
      {error && (
        <span className="font-['72:Regular',sans-serif] text-[12px] text-[var(--sapField_InvalidColor,#bb0000)] leading-[normal]">
          {error}
        </span>
      )}
    </div>
  );
}
