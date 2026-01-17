import { SelectHTMLAttributes } from 'react';

interface FioriSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  options?: Array<{ value: string; label: string }>;
}

export function FioriSelect({ label, error, fullWidth = false, options, className = '', children, ...props }: FioriSelectProps) {
  return (
    <div className={`flex flex-col gap-1 ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="font-['72:Regular',sans-serif] text-[14px] text-[var(--sapContent_LabelColor,#556b82)] leading-[normal]">
          {label}
        </label>
      )}
      <select
        className={`
          px-3 py-2 
          bg-[var(--sapField_Background,#ffffff)] 
          border border-[var(--sapField_BorderColor,#89919a)] 
          rounded-[4px] 
          font-['72:Regular',sans-serif] 
          text-[14px] 
          text-[var(--sapField_TextColor,#131e29)]
          hover:border-[var(--sapField_Hover_BorderColor,#0064d9)] 
          focus:outline-none 
          focus:border-[var(--sapField_Focus_BorderColor,#0064d9)]
          focus:shadow-[inset_0_0_0_1px_var(--sapField_Focus_BorderColor,#0064d9)]
          disabled:bg-[var(--sapField_ReadOnly_Background,#f7f7f7)]
          disabled:border-[var(--sapField_ReadOnly_BorderColor,#d9d9d9)]
          disabled:text-[var(--sapContent_LabelColor,#556b82)]
          disabled:cursor-not-allowed
          cursor-pointer
          transition-colors
          ${error ? 'border-[var(--sapField_InvalidColor,#bb0000)]' : ''}
          ${className}
        `}
        {...props}
      >
        {options ? (
          options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))
        ) : (
          children
        )}
      </select>
      {error && (
        <span className="font-['72:Regular',sans-serif] text-[12px] text-[var(--sapField_InvalidColor,#bb0000)] leading-[normal]">
          {error}
        </span>
      )}
    </div>
  );
}
