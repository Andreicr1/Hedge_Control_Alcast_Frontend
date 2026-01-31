import { Button, DateRangePicker, Label } from '@ui5/webcomponents-react';
import { useMemo } from 'react';

function isoFromLocalDate(d: Date | null): string | undefined {
  if (!d) return undefined;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function FioriDateRangePicker({
  label,
  startDateIso,
  endDateIso,
  placeholder = '',
  disabled,
  onChange,
  onClear,
}: {
  label?: string;
  startDateIso?: string;
  endDateIso?: string;
  placeholder?: string;
  disabled?: boolean;
  onChange: (next: { startDateIso?: string; endDateIso?: string }) => void;
  onClear?: () => void;
}) {
  const hasValue = Boolean(startDateIso || endDateIso);

  const value = useMemo(() => {
    if (!startDateIso || !endDateIso) return '';
    return `${startDateIso} - ${endDateIso}`;
  }, [startDateIso, endDateIso]);

  return (
    <div className="flex flex-col gap-1">
      {label ? <Label showColon>{label}</Label> : null}

      <div className="flex items-end gap-2">
        <div className="flex-1">
          <DateRangePicker
            accessibleName={label}
            value={value}
            valueFormat="yyyy-MM-dd"
            displayFormat="dd/MM/yyyy"
            delimiter=" - "
            placeholder={placeholder}
            disabled={disabled}
            onChange={(e) => {
              const start = isoFromLocalDate(e.target.startDateValue);
              const end = isoFromLocalDate(e.target.endDateValue);
              onChange({ startDateIso: start, endDateIso: end });
            }}
          />
        </div>

        {hasValue ? (
          <Button
            design="Transparent"
            disabled={disabled}
            onClick={() => {
              onClear?.();
              onChange({ startDateIso: undefined, endDateIso: undefined });
            }}
          >
            Limpar
          </Button>
        ) : null}
      </div>
    </div>
  );
}
