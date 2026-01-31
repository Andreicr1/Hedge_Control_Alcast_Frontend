import type { ChangeEventHandler } from 'react';

import { Input, Label } from '@ui5/webcomponents-react';
import InputType from '@ui5/webcomponents/dist/types/InputType.js';

type ChangeLikeEvent = { target: { value: string } };

export interface FioriInputProps {
  label?: string;
  value?: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  onChange?: (e: ChangeLikeEvent) => void;
}

function mapInputType(type?: string): InputType {
  const t = String(type || '').toLowerCase();
  if (t === 'date') return InputType.Date;
  if (t === 'email') return InputType.Email;
  if (t === 'number') return InputType.Number;
  if (t === 'password') return InputType.Password;
  if (t === 'tel') return InputType.Tel;
  if (t === 'url') return InputType.URL;
  return InputType.Text;
}

export function FioriInput({ label, value, type, placeholder, disabled, fullWidth, className, onChange }: FioriInputProps) {
  const handleInput: ChangeEventHandler<HTMLInputElement> = (e) => {
    onChange?.({ target: { value: e.target.value } });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', width: fullWidth ? '100%' : undefined }}>
      {label ? <Label>{label}</Label> : null}
      <Input
        className={className}
        value={value ?? ''}
        type={mapInputType(type)}
        placeholder={placeholder}
        disabled={disabled}
        onInput={handleInput as unknown as never}
      />
    </div>
  );
}
