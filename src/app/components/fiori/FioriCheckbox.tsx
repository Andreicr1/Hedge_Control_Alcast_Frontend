import { InputHTMLAttributes } from 'react';

interface FioriCheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string;
  error?: string;
  children?: React.ReactNode;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export function FioriCheckbox({ label, error, children, checked, onChange, className = '', ...props }: FioriCheckboxProps) {
  const displayLabel = children || label;
  
  return (
    <div className="flex flex-col gap-1">
      <label className="flex items-center gap-2 cursor-pointer group">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          className={`
            appearance-none
            w-[14px] h-[14px]
            border-2 border-[var(--sapField_BorderColor,#89919a)]
            rounded-[2px]
            cursor-pointer
            relative
            transition-all
            hover:border-[var(--sapField_Hover_BorderColor,#0064d9)]
            focus:outline-none
            focus:border-[var(--sapField_Focus_BorderColor,#0064d9)]
            focus:shadow-[0_0_0_1px_var(--sapField_Focus_BorderColor,#0064d9)]
            checked:bg-[var(--sapButton_TextColor,#0064d9)]
            checked:border-[var(--sapButton_TextColor,#0064d9)]
            disabled:bg-[var(--sapField_ReadOnly_Background,#f7f7f7)]
            disabled:border-[var(--sapField_ReadOnly_BorderColor,#d9d9d9)]
            disabled:cursor-not-allowed
            after:content-['']
            after:absolute
            after:left-[3px]
            after:top-[0px]
            after:w-[5px]
            after:h-[8px]
            after:border-white
            after:border-r-2
            after:border-b-2
            after:rotate-45
            after:opacity-0
            checked:after:opacity-100
            ${className}
          `}
          {...props}
        />
        {displayLabel && (
          <span className="font-['72:Regular',sans-serif] text-[14px] text-[var(--sapContent_ForegroundTextColor,#131e29)] leading-[normal] select-none">
            {displayLabel}
          </span>
        )}
      </label>
      {error && (
        <span className="font-['72:Regular',sans-serif] text-[12px] text-[var(--sapField_InvalidColor,#bb0000)] leading-[normal]">
          {error}
        </span>
      )}
    </div>
  );
}