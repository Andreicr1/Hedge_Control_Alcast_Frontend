/**
 * Cashflow Page - Integrated (read-only v0)
 *
 * Consumes GET /cashflow and renders a table-only view.
 * No valuation logic is computed client-side.
 */

import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCashflow, useCounterparties } from '../../hooks';
import type { CashflowItem, CashflowQueryParams } from '../../types';
import { ErrorState, LoadingState, EmptyState } from '../components/ui';
import { FioriButton } from '../components/fiori/FioriButton';
import { FioriInput } from '../components/fiori/FioriInput';
import { FioriTable } from '../components/fiori/FioriTable';
import { formatCurrency, formatDate } from '../../services/dashboard.service';
import { RefreshCw, Search, ExternalLink } from 'lucide-react';
import { useAuthContext } from '../components/AuthProvider';
import { normalizeRoleName } from '../../utils/role';
import { UX_COPY } from '../ux/copy';

function Badge({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs border bg-[var(--sapNeutralBackground,#f5f6f7)] border-[var(--sapUiBorderColor,#d9d9d9)] text-[var(--sapTextColor,#131e29)]">
      {children}
    </span>
  );
}

function toIsoDateOnly(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number): Date {
  const out = new Date(date);
  out.setDate(out.getDate() + days);
  return out;
}

function renderFlags(flags: string[]): ReactNode {
  if (!flags || flags.length === 0) {
    return <span className="text-xs text-[var(--sapContent_LabelColor)]">—</span>;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {flags.map((f) => (
        <span
          key={f}
          className="px-2 py-0.5 rounded-full text-[11px] border"
          style={{
            backgroundColor: 'var(--sapNeutralBackground,#f5f6f7)',
            borderColor: 'var(--sapUiBorderColor,#d9d9d9)',
            color: 'var(--sapTextColor,#131e29)',
          }}
          title={f}
        >
          {f}
        </span>
      ))}
    </div>
  );
}

export function CashflowPageIntegrated() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const role = normalizeRoleName(user?.role);

  // Locked defaults (v0): today → today+90d, as_of=today
  const today = useMemo(() => new Date(), []);
  const [startDate, setStartDate] = useState<string>(() => toIsoDateOnly(today));
  const [endDate, setEndDate] = useState<string>(() => toIsoDateOnly(addDays(today, 90)));
  const [asOf, setAsOf] = useState<string>(() => toIsoDateOnly(today));

  // Optional filters
  const [contractId, setContractId] = useState<string>('');
  const [counterpartyId, setCounterpartyId] = useState<string>('');
  const [dealId, setDealId] = useState<string>('');
  const [limit, setLimit] = useState<string>('200');

  // Apply pattern: editable inputs + applied params (stable)
  const [applied, setApplied] = useState<CashflowQueryParams>(() => ({
    start_date: toIsoDateOnly(today),
    end_date: toIsoDateOnly(addDays(today, 90)),
    as_of: toIsoDateOnly(today),
    limit: 200,
  }));

  const cashflow = useCashflow(applied);
  const counterparties = useCounterparties();

  const counterpartyNameById = useMemo(() => {
    const map = new Map<number, string>();
    for (const cp of counterparties.counterparties || []) {
      map.set(cp.id, cp.name);
    }
    return map;
  }, [counterparties.counterparties]);

  const items: CashflowItem[] = cashflow.data?.items ?? [];

  const rows = useMemo(() => {
    return items.map((it) => {
      const cpId = it.counterparty_id ?? null;
      const cpName = cpId != null ? counterpartyNameById.get(cpId) : undefined;
      return {
        ...it,
        counterparty_name: cpName || (cpId != null ? `#${cpId}` : '—'),
      } as Record<string, unknown>;
    });
  }, [items, counterpartyNameById]);

  const columns = useMemo(
    () => [
      {
        header: 'Data de liquidação',
        accessor: 'settlement_date',
        render: (value: unknown) => <span>{formatDate((value as string) || null)}</span>,
      },
      {
        header: 'Contraparte',
        accessor: 'counterparty_name',
      },
      {
        header: 'Contrato',
        accessor: 'contract_id',
        render: (value: unknown, row: Record<string, unknown>) => {
          const contract = String(value || '');
          const deal = row['deal_id'];
          return (
            <div className="flex items-center gap-2">
              <span className="font-['72:Bold',sans-serif] text-[#0064d9]">{contract}</span>
              {deal != null && (
                <button
                  type="button"
                  className="text-[var(--sapContent_LabelColor)] hover:text-[#0064d9]"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/financeiro/deals/${deal}`);
                  }}
                  aria-label="Abrir operação"
                  title="Abrir operação"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        },
      },
      {
        header: 'Operação',
        accessor: 'deal_id',
        align: 'right' as const,
      },
      {
        header: 'Cotação',
        accessor: 'rfq_id',
        align: 'right' as const,
      },
      {
        header: 'Valor previsto (USD)',
        accessor: 'projected_value_usd',
        align: 'right' as const,
        render: (value: unknown) => <span>{formatCurrency(value as number | null | undefined, 'USD')}</span>,
      },
      {
        header: 'Valor realizado (USD)',
        accessor: 'final_value_usd',
        align: 'right' as const,
        render: (value: unknown) => <span>{formatCurrency(value as number | null | undefined, 'USD')}</span>,
      },
      {
        header: 'Indicadores',
        accessor: 'data_quality_flags',
        render: (value: unknown) => renderFlags((value as string[]) || []),
      },
    ],
    [navigate]
  );

  const handleApply = () => {
    const next: CashflowQueryParams = {
      start_date: startDate || undefined,
      end_date: endDate || undefined,
      as_of: asOf || undefined,
      contract_id: contractId.trim() || undefined,
      counterparty_id: counterpartyId.trim() ? Number(counterpartyId) : undefined,
      deal_id: dealId.trim() ? Number(dealId) : undefined,
      limit: limit.trim() ? Number(limit) : 200,
    };

    setApplied(next);
  };

  if (cashflow.isLoading && !cashflow.data) {
    return <LoadingState message="Carregando fluxo de caixa..." fullPage />;
  }

  if (cashflow.isError) {
    return <ErrorState error={cashflow.error} onRetry={cashflow.refetch} fullPage />;
  }

  return (
    <div className="sap-fiori-page p-4">
      {/* Header */}
      <div className="bg-[var(--sapPageHeader_Background)] border-b border-[var(--sapPageHeader_BorderColor)] -mx-4 -mt-4 px-4 py-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-['72:Bold',sans-serif] text-xl text-[var(--sapTextColor,#131e29)]">
              {UX_COPY.pages.cashflow.title}
            </h1>
            <p className="text-sm text-[var(--sapContent_LabelColor,#556b82)] mt-1">
              {UX_COPY.pages.cashflow.subtitle}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge>Somente leitura</Badge>
            {role === 'auditoria' && <Badge>Auditoria</Badge>}
          </div>
          <FioriButton variant="ghost" icon={<RefreshCw className="w-4 h-4" />} onClick={cashflow.refetch}>
            Atualizar
          </FioriButton>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[var(--sapGroup_ContentBackground)] border border-[var(--sapGroup_ContentBorderColor)] rounded p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Search className="w-4 h-4 text-[var(--sapContent_LabelColor,#556b82)]" />
          <div className="font-['72:Bold',sans-serif] text-sm text-[var(--sapTextColor,#131e29)]">Filtros</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <FioriInput label="Início" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} fullWidth />
            <FioriInput label="Fim" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} fullWidth />
            <FioriInput label="Data-base" type="date" value={asOf} onChange={(e) => setAsOf(e.target.value)} fullWidth />

            <FioriInput label="Contrato" value={contractId} onChange={(e) => setContractId(e.target.value)} fullWidth />
            <FioriInput label="Contraparte" value={counterpartyId} onChange={(e) => setCounterpartyId(e.target.value)} fullWidth />
            <FioriInput label="Operação" value={dealId} onChange={(e) => setDealId(e.target.value)} fullWidth />

            <FioriInput label="Limite" value={limit} onChange={(e) => setLimit(e.target.value)} fullWidth />

          <div className="flex items-end">
            <FioriButton variant="emphasized" onClick={handleApply}>
              Aplicar
            </FioriButton>
          </div>
        </div>

        <div className="mt-3 text-xs text-[var(--sapContent_LabelColor,#556b82)]">
            Ajuste filtros e período conforme necessário.
        </div>
      </div>

      {/* Table */}
      {rows.length === 0 ? (
        <EmptyState
          title="Sem itens"
          description="Sem itens no período selecionado. Ajuste o intervalo de datas e tente novamente."
          fullPage
        />
      ) : (
        <FioriTable
          columns={columns}
          data={rows}
          idField="contract_id"
          emptyMessage="Sem itens"
          loading={cashflow.isLoading}
          stickyHeader
        />
      )}

      <div className="mt-3 text-xs text-[var(--sapContent_LabelColor,#556b82)]">
        Data-base considerada: <span className="font-['72:Bold',sans-serif]">{cashflow.data?.as_of || '—'}</span>
      </div>
    </div>
  );
}

export default CashflowPageIntegrated;
