/**
 * Canonical formatters (Sprint 3.2)
 *
 * Binding constraints:
 * - Presentation-only: does not infer business meaning, units, or eligibility.
 * - No change in value: formatting only.
 * - No change in precision unless explicitly requested by the call site.
 *
 * Canonical defaults:
 * - Locale: pt-BR (institutional Brazilian Portuguese)
 * - Currency formatting: caller must provide currency/precision intent.
 *
 * Notes:
 * - Some backends emit RFC3339 with microseconds; JS Date parsing may fail.
 *   We normalize fractional seconds to milliseconds (".ssssss" -> ".sss").
 */

export const CANONICAL_LOCALE = 'pt-BR' as const;

function normalizeIsoFractionalSeconds(iso: string): string {
  return String(iso)
    .trim()
    .replace(/\.(\d{3})\d+(?=(Z|[+-]\d{2}:\d{2})$)/, '.$1');
}

function safeDateFromIso(isoDate: string): Date | null {
  const normalized = normalizeIsoFractionalSeconds(isoDate);
  const d = new Date(normalized);
  return Number.isFinite(d.getTime()) ? d : null;
}

export type NumberLocale = string;

export function formatNumberAuto(value: number | null | undefined, locale: NumberLocale = CANONICAL_LOCALE): string {
  if (value === null || value === undefined) return '—';
  return new Intl.NumberFormat(locale).format(value);
}

/**
 * Mirrors JS default locale formatting (`value.toLocaleString()` / `new Intl.NumberFormat()`)
 * for cases where call sites previously relied on the runtime locale.
 */
export function formatNumberAutoRuntimeLocale(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—';
  return new Intl.NumberFormat().format(value);
}

/**
 * Formats a number using only a minimum fraction digits constraint.
 * This preserves call sites that previously used `toLocaleString(locale, { minimumFractionDigits })`
 * without specifying `maximumFractionDigits`.
 */
export function formatNumberMinFractionDigits(
  value: number | null | undefined,
  minimumFractionDigits: number,
  locale: NumberLocale = CANONICAL_LOCALE
): string {
  if (value === null || value === undefined) return '—';
  return new Intl.NumberFormat(locale, { minimumFractionDigits }).format(value);
}

export function formatNumberFixed(
  value: number | null | undefined,
  decimals: number,
  locale: NumberLocale = CANONICAL_LOCALE
): string {
  if (value === null || value === undefined) return '—';
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Fixed-decimal formatting without thousands grouping.
 * This matches the typical presentation of `toFixed(n)` while still using Intl.
 */
export function formatNumberFixedNoGrouping(
  value: number | null | undefined,
  decimals: number,
  locale: NumberLocale = CANONICAL_LOCALE
): string {
  if (value === null || value === undefined) return '—';
  return new Intl.NumberFormat(locale, {
    useGrouping: false,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatCurrencyFixed(
  value: number | null | undefined,
  currency: string,
  decimals: number,
  locale: NumberLocale = CANONICAL_LOCALE
): string {
  if (value === null || value === undefined) return '—';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Signed currency (e.g. "+R$ 1.234,56") matching Intl `signDisplay: 'always'`.
 */
export function formatCurrencySigned(
  value: number | null | undefined,
  currency: string,
  locale: NumberLocale = CANONICAL_LOCALE
): string {
  if (value === null || value === undefined) return '—';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    signDisplay: 'always',
  }).format(value);
}

/**
 * Legacy-compatible helper (kept for existing call sites): currency with 0 decimals.
 */
export function formatCurrency0(value: number | null | undefined, currency: string = 'USD', locale: NumberLocale = CANONICAL_LOCALE) {
  return formatCurrencyFixed(value, currency, 0, locale);
}

export function formatPercentSigned(value: number | null | undefined, decimals: number = 2): string {
  if (value === null || value === undefined) return '—';
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
}

export function formatDate(isoDate: string | null | undefined, locale: NumberLocale = CANONICAL_LOCALE): string {
  if (!isoDate) return '—';
  const d = safeDateFromIso(isoDate);
  if (!d) return isoDate;
  return d.toLocaleDateString(locale);
}

export function formatDateTime(isoDate: string | null | undefined, locale: NumberLocale = CANONICAL_LOCALE): string {
  if (!isoDate) return '—';
  const d = safeDateFromIso(isoDate);
  if (!d) return isoDate;
  return d.toLocaleString(locale);
}

export function formatDateTimeFromDate(date: Date | null | undefined, locale: NumberLocale = CANONICAL_LOCALE): string {
  if (!date) return '—';
  if (!Number.isFinite(date.getTime())) return '—';
  return date.toLocaleString(locale);
}

/**
 * Institutional local format: "18 jan 2026, 11:03".
 */
export function formatHumanDateTime(isoDate: string | null | undefined): string {
  if (!isoDate) return '—';
  const d = safeDateFromIso(isoDate);
  if (!d) return '—';

  const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'] as const;
  const dd = String(d.getDate()).padStart(2, '0');
  const mon = months[d.getMonth()] ?? '';
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');

  return `${dd} ${mon} ${yyyy}, ${hh}:${mm}`;
}

/**
 * Month/year label in UTC (e.g. "jan. de 2026" style, depending on locale)
 * Caller controls locale; Cashflow currently uses pt-BR.
 */
export function formatMonthYearUTC(date: Date, locale: NumberLocale = CANONICAL_LOCALE): string {
  return date.toLocaleString(locale, { month: 'short', year: 'numeric', timeZone: 'UTC' });
}

/**
 * Month/year label in local time (used when existing call sites relied on local timezone).
 */
export function formatMonthYearLongLocal(date: Date, locale: NumberLocale = CANONICAL_LOCALE): string {
  return date.toLocaleString(locale, { month: 'long', year: 'numeric' });
}
