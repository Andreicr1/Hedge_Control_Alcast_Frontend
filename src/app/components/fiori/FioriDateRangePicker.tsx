import * as Popover from '@radix-ui/react-popover';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { DayPicker, type DateRange } from 'react-day-picker';

function isoToDate(dateIso?: string | null): Date | undefined {
  if (!dateIso) return undefined;
  const d = new Date(`${dateIso}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

function dateToIso(d?: Date | null): string | undefined {
  if (!d) return undefined;
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function formatDateForField(dateIso?: string | null): string {
  if (!dateIso) return '';
  const d = new Date(`${dateIso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return String(dateIso);
  return d.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
}

export function FioriDateRangePicker({
  label,
  startDateIso,
  endDateIso,
  placeholder = 'Selecione um período',
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
  const [open, setOpen] = useState(false);

  const selected = useMemo<DateRange | undefined>(() => {
    const from = isoToDate(startDateIso);
    const to = isoToDate(endDateIso);
    if (!from && !to) return undefined;
    return { from, to };
  }, [startDateIso, endDateIso]);

  const valueLabel = useMemo(() => {
    const from = formatDateForField(startDateIso);
    const to = formatDateForField(endDateIso);
    if (!from && !to) return '';
    if (from && !to) return `${from} —`;
    return `${from} — ${to}`;
  }, [startDateIso, endDateIso]);

  const hasValue = Boolean(startDateIso || endDateIso);

  return (
    <div className="flex flex-col gap-1">
      {label ? <div className="text-[11px] text-[var(--sapContent_LabelColor)]">{label}</div> : null}

      <Popover.Root open={open} onOpenChange={(v) => !disabled && setOpen(v)}>
        <Popover.Trigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={
              `h-8 w-full rounded-[4px] border border-[var(--sapField_BorderColor,#89919a)] bg-[var(--sapField_Background,#ffffff)] ` +
              `px-2 text-left text-[13px] font-['72:Regular',sans-serif] text-[var(--sapField_TextColor,#131e29)] ` +
              `hover:border-[var(--sapField_Hover_BorderColor,#0064d9)] focus:outline-none focus:border-[var(--sapField_Focus_BorderColor,#0064d9)] ` +
              `focus:shadow-[inset_0_0_0_1px_var(--sapField_Focus_BorderColor,#0064d9)] ` +
              `disabled:bg-[var(--sapField_ReadOnly_Background)] disabled:text-[var(--sapContent_LabelColor)] disabled:cursor-not-allowed ` +
              `flex items-center gap-2`
            }
          >
            <CalendarIcon className="w-4 h-4 text-[var(--sapContent_IconColor)] shrink-0" />
            <span className={valueLabel ? '' : 'text-[var(--sapField_PlaceholderTextColor)]'}>{valueLabel || placeholder}</span>
            <span className="flex-1" />
            {hasValue ? (
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClear?.();
                  onChange({ startDateIso: undefined, endDateIso: undefined });
                }}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter' && e.key !== ' ') return;
                  e.preventDefault();
                  onClear?.();
                  onChange({ startDateIso: undefined, endDateIso: undefined });
                }}
                className="inline-flex items-center justify-center w-6 h-6 rounded hover:bg-black/5"
                title="Limpar"
                aria-label="Limpar"
              >
                <X className="w-3.5 h-3.5 text-[var(--sapContent_IconColor)]" />
              </span>
            ) : null}
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={6}
            className="z-50 rounded border border-[var(--sapList_BorderColor)] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] p-2"
          >
            <DayPicker
              mode="range"
              numberOfMonths={1}
              fixedWeeks={false}
              showOutsideDays={false}
              selected={selected}
              onSelect={(range) => {
                const nextStart = dateToIso(range?.from);
                const nextEnd = dateToIso(range?.to);
                onChange({ startDateIso: nextStart, endDateIso: nextEnd });
                if (range?.from && range?.to) setOpen(false);
              }}
              className="p-1"
              classNames={{
                months: 'flex flex-col gap-2',
                month: 'space-y-2',
                caption: 'flex justify-between items-center px-1',
                caption_label: "text-[12px] font-['72:Bold',sans-serif] text-[var(--sapContent_LabelColor)]",
                nav: 'flex items-center gap-1',
                nav_button:
                  'w-7 h-7 rounded border border-[var(--sapButton_BorderColor)] bg-[var(--sapButton_Background)] hover:bg-black/5 flex items-center justify-center',
                table: 'w-full border-collapse',
                head_row: 'flex',
                head_cell: "w-8 text-center text-[10px] text-[var(--sapContent_LabelColor)]",
                row: 'flex w-full',
                cell: 'w-8 h-8 p-0 text-center',
                day:
                  "w-8 h-8 rounded text-[12px] font-['72:Regular',sans-serif] hover:bg-black/5 focus:outline-none",
                day_today: 'font-[700]',
                day_outside: 'opacity-40',
                day_disabled: 'opacity-40',
                day_selected: 'bg-[var(--sapSelectedColor,#0064d9)] text-white hover:bg-[var(--sapSelectedColor,#0064d9)]',
                day_range_start: 'bg-[var(--sapSelectedColor,#0064d9)] text-white rounded-l',
                day_range_end: 'bg-[var(--sapSelectedColor,#0064d9)] text-white rounded-r',
                day_range_middle: 'bg-[var(--sapSelectionColor,#dcefff)]',
              }}
            />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
