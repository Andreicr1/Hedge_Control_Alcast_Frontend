import { TextareaHTMLAttributes } from 'react';

interface FioriTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export function FioriTextarea({ label, error, fullWidth = false, className = '', ...props }: FioriTextareaProps) {
  return (
    <div className={`flex flex-col gap-1 ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="font-['72:Regular',sans-serif] text-[14px] text-[var(--sapContent_LabelColor,#556b82)] leading-[normal]">
          {label}
        </label>
      )}
      <textarea
        className={`
          px-3 py-2 
          bg-[var(--sapField_Background,#ffffff)] 
          border border-[var(--sapField_BorderColor,#89919a)] 
          rounded-[4px] 
          font-['72:Regular',sans-serif] 
          text-[14px] 
          text-[var(--sapField_TextColor,#131e29)] 
          placeholder:text-[var(--sapField_PlaceholderTextColor,#556b82)]
          hover:border-[var(--sapField_Hover_BorderColor,#0064d9)] 
          focus:outline-none 
          focus:border-[var(--sapField_Focus_BorderColor,#0064d9)]
          focus:shadow-[inset_0_0_0_1px_var(--sapField_Focus_BorderColor,#0064d9)]
          disabled:bg-[var(--sapField_ReadOnly_Background,#f7f7f7)]
          disabled:border-[var(--sapField_ReadOnly_BorderColor,#d9d9d9)]
          disabled:text-[var(--sapContent_LabelColor,#556b82)]
          disabled:cursor-not-allowed
          transition-colors
          resize-vertical
          ${error ? 'border-[var(--sapField_InvalidColor,#bb0000)]' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <span className="font-['72:Regular',sans-serif] text-[12px] text-[var(--sapField_InvalidColor,#bb0000)] leading-[normal]">
          {error}
        </span>
      )}
    </div>
  );
}
