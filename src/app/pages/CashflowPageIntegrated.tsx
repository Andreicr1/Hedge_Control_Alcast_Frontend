/**
 * Cashflow Page - Integrated (Analytic Tree View)
 *
 * Consumes GET /cashflow/analytic and renders a hierarchical tree:
 * Consolidated → Deal → (SO/PO/Contract/Exposure).
 *
 * Frontend ONLY aggregates/sums amounts; it does not infer valuation.
 */

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCashflowAnalytic } from '../../hooks';
import type { CashFlowConfidence, CashFlowLine, CashFlowType, CashflowAnalyticQueryParams } from '../../types';
import { ErrorState, LoadingState, EmptyState } from '../components/ui';
import { FioriButton } from '../components/fiori/FioriButton';
import { FioriInput } from '../components/fiori/FioriInput';
import { Checkbox } from '../components/ui/checkbox';
import { formatCurrency, formatDate } from '../../services/dashboard.service';
import { ChevronDown, ChevronRight, ExternalLink, RefreshCw, Search } from 'lucide-react';
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

type Granularity = 'day' | 'week' | 'month' | 'quarter';

function parseDateOnly(dateStr: string): Date {
  // Interpret YYYY-MM-DD as UTC midnight to avoid TZ shifting.
  return new Date(`${dateStr}T00:00:00Z`);
}

function formatIsoDateOnly(d: Date): string {
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function startOfWeekMonday(d: Date): Date {
  const out = new Date(d);
  const day = out.getUTCDay();
  const delta = (day + 6) % 7; // Mon=0 ... Sun=6
  out.setUTCDate(out.getUTCDate() - delta);
  return out;
}

function bucketKey(dateStr: string, granularity: Granularity): string {
  const d = parseDateOnly(dateStr);
  if (granularity === 'day') return dateStr;
  if (granularity === 'week') return formatIsoDateOnly(startOfWeekMonday(d));
  if (granularity === 'month') {
    d.setUTCDate(1);
    return formatIsoDateOnly(d);
  }
  // quarter
  const m = d.getUTCMonth();
  const qStartMonth = Math.floor(m / 3) * 3;
  d.setUTCMonth(qStartMonth, 1);
  return formatIsoDateOnly(d);
}

type SignedTotals = {
  inflow: number;
  outflow: number;
  net: number;
};

function accumulateTotals(lines: CashFlowLine[]): SignedTotals {
  let inflow = 0;
  let outflow = 0;
  for (const l of lines) {
    if (l.direction === 'inflow') inflow += l.amount;
    else outflow += l.amount;
  }
  return { inflow, outflow, net: inflow - outflow };
}

function entityLabel(line: CashFlowLine): string {
  const ref = (line.source_reference || '').trim();
  const base = `${line.entity_type.toUpperCase()} #${line.entity_id}`;
  if (!ref) return base;
  if (ref === line.entity_id) return base;
  return `${base} (${ref})`;
}

type TreeEntityNode = {
  kind: 'entity';
  id: string;
  dealId: string;
  entity_type: CashFlowLine['entity_type'];
  entity_id: string;
  label: string;
  lines: CashFlowLine[];
  totals: SignedTotals;
};

type TreeDealNode = {
  kind: 'deal';
  id: string;
  dealId: string;
  label: string;
  children: TreeEntityNode[];
  totals: SignedTotals;
};

type TreeRootNode = {
  kind: 'root';
  id: 'root';
  label: string;
  children: TreeDealNode[];
  totals: SignedTotals;
};

function buildTree(lines: CashFlowLine[]): TreeRootNode {
  const byDeal = new Map<string, CashFlowLine[]>();
  for (const l of lines) {
    const dealId = (l.parent_id || '—').trim() || '—';
    const arr = byDeal.get(dealId) || [];
    arr.push(l);
    byDeal.set(dealId, arr);
  }

  const dealNodes: TreeDealNode[] = Array.from(byDeal.entries())
    .sort(([a], [b]) => {
      const na = Number(a);
      const nb = Number(b);
      const aIsNum = Number.isFinite(na) && String(na) === a;
      const bIsNum = Number.isFinite(nb) && String(nb) === b;
      if (aIsNum && bIsNum) return na - nb;
      if (aIsNum) return -1;
      if (bIsNum) return 1;
      return a.localeCompare(b);
    })
    .map(([dealId, dealLines]) => {
      const byEntity = new Map<string, CashFlowLine[]>();
      for (const l of dealLines) {
        const key = `${l.entity_type}:${l.entity_id}`;
        const arr = byEntity.get(key) || [];
        arr.push(l);
        byEntity.set(key, arr);
      }

      const entityOrder: Record<string, number> = {
        so: 1,
        po: 2,
        contract: 3,
        exposure: 4,
        deal: 5,
      };

      const children: TreeEntityNode[] = Array.from(byEntity.entries())
        .map(([id, entityLines]) => {
          const first = entityLines[0]!;
          return {
            kind: 'entity' as const,
            id,
            dealId,
            entity_type: first.entity_type,
            entity_id: first.entity_id,
            label: entityLabel(first),
            lines: entityLines,
            totals: accumulateTotals(entityLines),
          };
        })
        .sort((a, b) => {
          const oa = entityOrder[a.entity_type] ?? 999;
          const ob = entityOrder[b.entity_type] ?? 999;
          if (oa !== ob) return oa - ob;
          const na = Number(a.entity_id);
          const nb = Number(b.entity_id);
          const aIsNum = Number.isFinite(na);
          const bIsNum = Number.isFinite(nb);
          if (aIsNum && bIsNum) return na - nb;
          return a.entity_id.localeCompare(b.entity_id);
        });

      return {
        kind: 'deal' as const,
        id: `deal:${dealId}`,
        dealId,
        label: dealId === '—' ? 'Deal —' : `Deal #${dealId}`,
        children,
        totals: accumulateTotals(dealLines),
      };
    });

  return {
    kind: 'root' as const,
    id: 'root',
    label: 'Consolidado',
    children: dealNodes,
    totals: accumulateTotals(lines),
  };
}

function formatTotals(t: SignedTotals): string {
  // Net shown with sign; inflow/outflow always positive.
  return `${formatCurrency(t.net, 'USD')}  (in: ${formatCurrency(t.inflow, 'USD')} | out: ${formatCurrency(t.outflow, 'USD')})`;
}

export function CashflowPageIntegrated() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const role = normalizeRoleName(user?.role);

  // Defaults: today → today+90d, as_of=today
  const today = useMemo(() => new Date(), []);
  const [startDate, setStartDate] = useState<string>(() => toIsoDateOnly(today));
  const [endDate, setEndDate] = useState<string>(() => toIsoDateOnly(addDays(today, 90)));
  const [asOf, setAsOf] = useState<string>(() => toIsoDateOnly(today));

  const [dealId, setDealId] = useState<string>('');
  const [granularity, setGranularity] = useState<Granularity>('month');
  const [showRawLines, setShowRawLines] = useState<boolean>(false);
  const [rawLimit, setRawLimit] = useState<number>(200);
  const [typeFilter, setTypeFilter] = useState<Record<CashFlowType, boolean>>({
    physical: true,
    financial: true,
    risk: true,
  });
  const [confidenceFilter, setConfidenceFilter] = useState<Record<CashFlowConfidence, boolean>>({
    deterministic: true,
    estimated: true,
    risk: true,
  });

  // Apply pattern: editable inputs + applied params (stable)
  const [applied, setApplied] = useState<CashflowAnalyticQueryParams>(() => ({
    start_date: toIsoDateOnly(today),
    end_date: toIsoDateOnly(addDays(today, 90)),
    as_of: toIsoDateOnly(today),
  }));

  const cashflow = useCashflowAnalytic(applied);

  const filteredLines = useMemo(() => {
    const lines = cashflow.data ?? [];
    return lines.filter((l) => typeFilter[l.cashflow_type] && confidenceFilter[l.confidence]);
  }, [cashflow.data, typeFilter, confidenceFilter]);

  const tree = useMemo(() => buildTree(filteredLines), [filteredLines]);
  const [openDeals, setOpenDeals] = useState<Record<string, boolean>>({});
  const [selectedNode, setSelectedNode] = useState<{ kind: 'root' } | { kind: 'deal'; dealId: string } | { kind: 'entity'; id: string }>(
    { kind: 'root' }
  );

  const selectedLines = useMemo(() => {
    if (selectedNode.kind === 'root') return filteredLines;
    if (selectedNode.kind === 'deal') return filteredLines.filter((l) => String(l.parent_id || '—') === selectedNode.dealId);
    return filteredLines.filter((l) => `${l.entity_type}:${l.entity_id}` === selectedNode.id);
  }, [filteredLines, selectedNode]);

  const rawLines = useMemo(() => {
    const sorted = [...selectedLines].sort((a, b) => {
      const dc = a.date.localeCompare(b.date);
      if (dc !== 0) return dc;
      const tc = a.cashflow_type.localeCompare(b.cashflow_type);
      if (tc !== 0) return tc;
      const ec = a.entity_type.localeCompare(b.entity_type);
      if (ec !== 0) return ec;
      return a.entity_id.localeCompare(b.entity_id);
    });
    return sorted.slice(0, Math.max(1, rawLimit));
  }, [selectedLines, rawLimit]);

  const bucketRows = useMemo(() => {
    const map = new Map<string, { bucket: string; inflow: number; outflow: number }>();
    for (const l of selectedLines) {
      const bucket = bucketKey(l.date, granularity);
      const row = map.get(bucket) || { bucket, inflow: 0, outflow: 0 };
      if (l.direction === 'inflow') row.inflow += l.amount;
      else row.outflow += l.amount;
      map.set(bucket, row);
    }
    return Array.from(map.values())
      .sort((a, b) => a.bucket.localeCompare(b.bucket))
      .map((r) => ({
        ...r,
        net: r.inflow - r.outflow,
      }));
  }, [selectedLines, granularity]);

  const handleApply = () => {
    const next: CashflowAnalyticQueryParams = {
      start_date: startDate || undefined,
      end_date: endDate || undefined,
      as_of: asOf || undefined,
      deal_id: dealId.trim() ? Number(dealId) : undefined,
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

          <FioriInput label="Operação (Deal)" value={dealId} onChange={(e) => setDealId(e.target.value)} fullWidth />

          <div className="flex flex-col">
            <label
              htmlFor="cashflow-analytic-granularity"
              className="text-xs text-[var(--sapContent_LabelColor,#556b82)] mb-1"
            >
              Granularidade
            </label>
            <select
              id="cashflow-analytic-granularity"
              className="h-[2.5rem] rounded border border-[var(--sapUiFieldBorderColor,#89919a)] bg-white px-2"
              value={granularity}
              onChange={(e) => setGranularity(e.target.value as Granularity)}
              aria-label="Granularidade"
            >
              <option value="day">Diário</option>
              <option value="week">Semanal</option>
              <option value="month">Mensal</option>
              <option value="quarter">Trimestral</option>
            </select>
          </div>

          <div className="flex items-end">
            <FioriButton variant="emphasized" onClick={handleApply}>
              Aplicar
            </FioriButton>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-[var(--sapContent_LabelColor,#556b82)] mb-2">Tipos</div>
            <div className="flex flex-wrap gap-4">
              {(['physical', 'financial', 'risk'] as CashFlowType[]).map((t) => (
                <label key={t} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={typeFilter[t]}
                    onCheckedChange={(v) => setTypeFilter((p) => ({ ...p, [t]: Boolean(v) }))}
                  />
                  <span>{t}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs text-[var(--sapContent_LabelColor,#556b82)] mb-2">Confiança</div>
            <div className="flex flex-wrap gap-4">
              {(['deterministic', 'estimated', 'risk'] as CashFlowConfidence[]).map((c) => (
                <label key={c} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={confidenceFilter[c]}
                    onCheckedChange={(v) => setConfidenceFilter((p) => ({ ...p, [c]: Boolean(v) }))}
                  />
                  <span>{c}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-3 text-xs text-[var(--sapContent_LabelColor,#556b82)]">
          A UI apenas soma valores do backend; não recalcula valuation.
        </div>
      </div>

      {/* Tree + Details */}
      {filteredLines.length === 0 ? (
        <EmptyState
          title="Sem itens"
          description="Sem itens no período/filtros selecionados. Ajuste e tente novamente."
          fullPage
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-5 bg-[var(--sapGroup_ContentBackground)] border border-[var(--sapGroup_ContentBorderColor)] rounded p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-['72:Bold',sans-serif] text-sm text-[var(--sapTextColor,#131e29)]">Árvore</div>
                <div className="text-xs text-[var(--sapContent_LabelColor,#556b82)]">{tree.label}</div>
              </div>
              <div className="text-xs text-[var(--sapContent_LabelColor,#556b82)]">{formatTotals(tree.totals)}</div>
            </div>

            <button
              type="button"
              className="w-full text-left px-2 py-2 rounded hover:bg-[var(--sapList_Hover_Background,#f5f6f7)]"
              onClick={() => setSelectedNode({ kind: 'root' })}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[var(--sapTextColor,#131e29)] font-['72:Bold',sans-serif]">Consolidado</span>
                </div>
                <span className="text-xs text-[var(--sapContent_LabelColor,#556b82)]">{formatTotals(tree.totals)}</span>
              </div>
            </button>

            <div className="mt-2">
              {tree.children.map((deal) => {
                const isOpen = openDeals[deal.dealId] ?? true;
                return (
                  <div key={deal.id} className="border-t border-[var(--sapList_BorderColor,#e5e5e5)] pt-2 mt-2">
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        className="flex items-center gap-2 px-2 py-1 rounded hover:bg-[var(--sapList_Hover_Background,#f5f6f7)]"
                        onClick={() => setOpenDeals((p) => ({ ...p, [deal.dealId]: !isOpen }))}
                        aria-label={isOpen ? 'Recolher' : 'Expandir'}
                      >
                        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        <span className="font-['72:Bold',sans-serif] text-sm text-[var(--sapTextColor,#131e29)]">{deal.label}</span>
                      </button>
                      <div className="flex items-center gap-2">
                        {deal.dealId !== '—' && (
                          <button
                            type="button"
                            className="text-[var(--sapContent_LabelColor)] hover:text-[#0064d9]"
                            onClick={() => navigate(`/financeiro/deals/${deal.dealId}`)}
                            aria-label="Abrir operação"
                            title="Abrir operação"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        )}
                        <span className="text-xs text-[var(--sapContent_LabelColor,#556b82)]">{formatTotals(deal.totals)}</span>
                      </div>
                    </div>

                    {isOpen && (
                      <div className="mt-1">
                        {deal.children.map((ent) => (
                          <button
                            key={ent.id}
                            type="button"
                            className="w-full text-left px-2 py-2 rounded hover:bg-[var(--sapList_Hover_Background,#f5f6f7)]"
                            onClick={() => setSelectedNode({ kind: 'entity', id: ent.id })}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-[var(--sapContent_LabelColor,#556b82)]">{ent.entity_type.toUpperCase()}</span>
                                <span className="text-sm text-[var(--sapTextColor,#131e29)]">{ent.label}</span>
                              </div>
                              <span className="text-xs text-[var(--sapContent_LabelColor,#556b82)]">{formatTotals(ent.totals)}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-7 bg-[var(--sapGroup_ContentBackground)] border border-[var(--sapGroup_ContentBorderColor)] rounded p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-['72:Bold',sans-serif] text-sm text-[var(--sapTextColor,#131e29)]">Resumo</div>
                <div className="text-xs text-[var(--sapContent_LabelColor,#556b82)]">Agregado por {granularity}</div>
              </div>
              <div className="text-xs text-[var(--sapContent_LabelColor,#556b82)]">
                {formatTotals(accumulateTotals(selectedLines))}
              </div>
            </div>

            {bucketRows.length === 0 ? (
              <div className="text-sm text-[var(--sapContent_LabelColor,#556b82)]">Selecione um nó para ver detalhes.</div>
            ) : (
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-[var(--sapContent_LabelColor,#556b82)] border-b border-[var(--sapList_BorderColor,#e5e5e5)]">
                      <th className="py-2 pr-2">Período</th>
                      <th className="py-2 px-2 text-right">Inflow (USD)</th>
                      <th className="py-2 px-2 text-right">Outflow (USD)</th>
                      <th className="py-2 pl-2 text-right">Net (USD)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bucketRows.map((r) => (
                      <tr key={r.bucket} className="border-b border-[var(--sapList_BorderColor,#f0f0f0)]">
                        <td className="py-2 pr-2 whitespace-nowrap">{formatDate(r.bucket)}</td>
                        <td className="py-2 px-2 text-right whitespace-nowrap">{formatCurrency(r.inflow, 'USD')}</td>
                        <td className="py-2 px-2 text-right whitespace-nowrap">{formatCurrency(r.outflow, 'USD')}</td>
                        <td className="py-2 pl-2 text-right whitespace-nowrap">{formatCurrency(r.net, 'USD')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-5 border-t border-[var(--sapList_BorderColor,#e5e5e5)] pt-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-['72:Bold',sans-serif] text-sm text-[var(--sapTextColor,#131e29)]">Linhas (raw)</div>
                  <div className="text-xs text-[var(--sapContent_LabelColor,#556b82)]">
                    Exibe as linhas diárias do backend para o nó selecionado.
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <label htmlFor="cashflow-raw-limit" className="text-xs text-[var(--sapContent_LabelColor,#556b82)]">
                      Limite
                    </label>
                    <input
                      id="cashflow-raw-limit"
                      type="number"
                      min={1}
                      max={2000}
                      value={rawLimit}
                      onChange={(e) => setRawLimit(Number(e.target.value || 200))}
                      className="h-9 w-24 rounded border border-[var(--sapUiFieldBorderColor,#89919a)] bg-white px-2 text-sm"
                    />
                  </div>
                  <FioriButton variant="ghost" onClick={() => setShowRawLines((v) => !v)}>
                    {showRawLines ? 'Ocultar' : 'Mostrar'}
                  </FioriButton>
                </div>
              </div>

              {showRawLines && (
                <>
                  {selectedLines.length > rawLimit && (
                    <div className="mt-2 text-xs text-[var(--sapContent_LabelColor,#556b82)]">
                      Mostrando {rawLines.length} de {selectedLines.length} linhas (aumente o limite para ver mais).
                    </div>
                  )}
                  <div className="mt-3 overflow-auto max-h-[360px]">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs text-[var(--sapContent_LabelColor,#556b82)] border-b border-[var(--sapList_BorderColor,#e5e5e5)]">
                          <th className="py-2 pr-2">Data</th>
                          <th className="py-2 px-2">Tipo</th>
                          <th className="py-2 px-2">Dir</th>
                          <th className="py-2 px-2 text-right">Amount</th>
                          <th className="py-2 px-2">Entidade</th>
                          <th className="py-2 px-2">PriceType</th>
                          <th className="py-2 px-2">Valuation</th>
                          <th className="py-2 px-2">Ref</th>
                          <th className="py-2 px-2">Conf</th>
                          <th className="py-2 px-2 text-right">Qty</th>
                          <th className="py-2 px-2 text-right">Px</th>
                          <th className="py-2 pl-2">Explicação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rawLines.map((l) => (
                          <tr
                            key={`${l.entity_type}:${l.entity_id}:${l.cashflow_type}:${l.date}:${l.direction}:${l.confidence}`}
                            className="border-b border-[var(--sapList_BorderColor,#f0f0f0)]"
                          >
                            <td className="py-2 pr-2 whitespace-nowrap">{formatDate(l.date)}</td>
                            <td className="py-2 px-2 whitespace-nowrap">{l.cashflow_type}</td>
                            <td className="py-2 px-2 whitespace-nowrap">{l.direction}</td>
                            <td className="py-2 px-2 text-right whitespace-nowrap">{formatCurrency(l.amount, 'USD')}</td>
                            <td className="py-2 px-2 whitespace-nowrap">{l.entity_type}#{l.entity_id}</td>
                            <td className="py-2 px-2 whitespace-nowrap">{l.price_type || '—'}</td>
                            <td className="py-2 px-2 whitespace-nowrap">{l.valuation_method}</td>
                            <td className="py-2 px-2 whitespace-nowrap">{l.valuation_reference_date || '—'}</td>
                            <td className="py-2 px-2 whitespace-nowrap">{l.confidence}</td>
                            <td className="py-2 px-2 text-right whitespace-nowrap">
                              {l.quantity_mt == null ? '—' : String(l.quantity_mt)}
                            </td>
                            <td className="py-2 px-2 text-right whitespace-nowrap">
                              {l.unit_price_used == null ? '—' : String(l.unit_price_used)}
                            </td>
                            <td className="py-2 pl-2">
                              <span
                                className="block max-w-[28rem] truncate text-[var(--sapContent_LabelColor,#556b82)]"
                                title={l.explanation || ''}
                              >
                                {l.explanation || '—'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-3 text-xs text-[var(--sapContent_LabelColor,#556b82)]">
        Data-base considerada: <span className="font-['72:Bold',sans-serif]">{applied.as_of || '—'}</span>
        {cashflow.data?.[0]?.as_of ? (
          <>
            {' '}
            (backend as_of: <span className="font-['72:Bold',sans-serif]">{cashflow.data[0].as_of}</span>)
          </>
        ) : null}
      </div>
    </div>
  );
}

export default CashflowPageIntegrated;
