import { Label, Option, Select } from '@ui5/webcomponents-react';

type ChangeLikeEvent = { target: { value: string } };

export interface FioriSelectOption {
  value: string;
  label: string;
}

export interface FioriSelectProps {
  label?: string;
  value?: string;
  options: FioriSelectOption[];
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  onChange?: (e: ChangeLikeEvent) => void;
}

export function FioriSelect({ label, value, options, disabled, fullWidth, className, onChange }: FioriSelectProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', width: fullWidth ? '100%' : undefined }}>
      {label ? <Label>{label}</Label> : null}
      <Select
        className={className}
        value={value ?? ''}
        disabled={disabled}
        onChange={((e: unknown) => {
          const selectedValue = String((e as any)?.detail?.selectedOption?.value ?? (e as any)?.target?.value ?? '');
          onChange?.({ target: { value: selectedValue } });
        }) as never}
      >
        {options.map((opt) => (
          <Option key={opt.value} value={opt.value} selected={String(value ?? '') === opt.value}>
            {opt.label}
          </Option>
        ))}
      </Select>
    </div>
  );
}
