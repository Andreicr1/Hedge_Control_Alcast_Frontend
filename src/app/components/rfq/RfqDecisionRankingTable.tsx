import { useMemo } from 'react';
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { FioriButton } from '../fiori/FioriButton';
import type { RfqQuote } from '../../../types';

export type RankedTrade = {
  groupId: string;
  quotes: RfqQuote[];
  spread: number | null;
  rank: number;
};

type Row = {
  groupId: string;
  rank: number;
  counterpartyName: string;
  buyPrice: number | null;
  sellPrice: number | null;
  spread: number | null;
  isBest: boolean;
  isSelected: boolean;
  selectQuote: RfqQuote | null;
};

function formatNumber(value: number | null | undefined, opts?: Intl.NumberFormatOptions): string {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '—';
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2, ...opts });
}

export interface RfqDecisionRankingTableProps {
  trades: RankedTrade[];
  winnerQuoteId?: number | null;
  canSelect?: boolean;
  onSelect?: (quote: RfqQuote) => void;
  isSelectionDisabled?: boolean;
}

export function RfqDecisionRankingTable({
  trades,
  winnerQuoteId,
  canSelect = false,
  onSelect,
  isSelectionDisabled = false,
}: RfqDecisionRankingTableProps) {
  const rows: Row[] = useMemo(() => {
    return (trades || []).map((trade) => {
      const buyLeg = trade.quotes.find((q) => q.leg_side === 'buy') || null;
      const sellLeg = trade.quotes.find((q) => q.leg_side === 'sell') || null;
      const counterpartyName = buyLeg?.counterparty_name || sellLeg?.counterparty_name || '—';

      const isSelected =
        typeof winnerQuoteId === 'number' &&
        Number.isFinite(winnerQuoteId) &&
        trade.quotes.some((q) => q.id === winnerQuoteId);

      return {
        groupId: trade.groupId,
        rank: trade.rank,
        counterpartyName,
        buyPrice: buyLeg?.quote_price ?? null,
        sellPrice: sellLeg?.quote_price ?? null,
        spread: trade.spread,
        isBest: trade.rank === 1,
        isSelected,
        selectQuote: buyLeg || sellLeg,
      };
    });
  }, [trades, winnerQuoteId]);

  const columns = useMemo<ColumnDef<Row>[]>(
    () => [
      {
        accessorKey: 'rank',
        header: 'Rank',
        cell: ({ row }) => {
          const v = row.original.rank;
          return <span className="font-['72:Bold',sans-serif]">{v}º</span>;
        },
      },
      {
        accessorKey: 'counterpartyName',
        header: 'Contraparte',
        cell: ({ row }) => {
          const { counterpartyName, isSelected } = row.original;
          return (
            <div className="min-w-[220px]">
              <div className={`text-sm ${isSelected ? "font-['72:Bold',sans-serif]" : "font-['72:Regular',sans-serif]"}`}>
                {counterpartyName}
              </div>
              {isSelected && (
                <div className="text-xs text-[var(--sapContent_LabelColor)]">Selecionada</div>
              )}
            </div>
          );
        },
      },
      {
        id: 'buy',
        header: 'Compra',
        cell: ({ row }) => (
          <span className="tabular-nums">{formatNumber(row.original.buyPrice)}</span>
        ),
        meta: { align: 'right' as const },
      },
      {
        id: 'sell',
        header: 'Venda',
        cell: ({ row }) => (
          <span className="tabular-nums">{formatNumber(row.original.sellPrice)}</span>
        ),
        meta: { align: 'right' as const },
      },
      {
        accessorKey: 'spread',
        header: 'Diferença',
        cell: ({ row }) => {
          const v = row.original.spread;
          const emphasize = row.original.isBest || row.original.isSelected;
          return (
            <span
              className={`tabular-nums ${emphasize ? "font-['72:Bold',sans-serif]" : "font-['72:Regular',sans-serif]"}`}
            >
              {formatNumber(v)}
            </span>
          );
        },
        meta: { align: 'right' as const },
      },
      {
        id: 'action',
        header: 'Ação',
        cell: ({ row }) => {
          if (!canSelect) return null;
          const quote = row.original.selectQuote;
          const disabled = isSelectionDisabled || !quote || !onSelect;
          return (
            <FioriButton variant="default" onClick={() => quote && onSelect?.(quote)} disabled={disabled}>
              Selecionar
            </FioriButton>
          );
        },
      },
    ],
    [canSelect, isSelectionDisabled, onSelect]
  );

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!rows.length) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="font-['72:Bold',sans-serif] text-base text-[#131e29] mb-4">
        Ranking de Cotações
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[760px]">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b border-[var(--sapList_HeaderBorderColor)]">
                {hg.headers.map((header) => {
                  const meta = header.column.columnDef.meta as any;
                  const align = meta?.align === 'right' ? 'text-right' : 'text-left';

                  const isRank = header.column.id === 'rank';
                  const isAction = header.column.id === 'action';

                  return (
                    <th
                      key={header.id}
                      className={`p-2 font-['72:Bold',sans-serif] text-[var(--sapList_HeaderTextColor)] ${align} ${
                        isRank ? 'sticky left-0 z-10 bg-[var(--sapList_HeaderBackground)]' : ''
                      } ${isAction ? 'sticky right-0 z-10 bg-[var(--sapList_HeaderBackground)]' : ''}`}
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => {
              const bg = row.original.isSelected
                ? 'bg-[var(--sapList_SelectionBackgroundColor)]'
                : row.original.isBest
                  ? 'bg-[var(--sapInformationBackground,#f5faff)]'
                  : 'bg-white';

              const border = row.original.isSelected
                ? 'border-l-2 border-l-[var(--sapList_SelectionBorderColor)]'
                : row.original.isBest
                  ? 'border-l-2 border-l-[var(--sapPositiveColor)]'
                  : '';

              return (
                <tr
                  key={row.id}
                  className={`border-b border-[var(--sapList_BorderColor)] hover:bg-[var(--sapList_HoverBackground)] ${bg} ${border}`}
                >
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta as any;
                    const align = meta?.align === 'right' ? 'text-right' : 'text-left';

                    const isRank = cell.column.id === 'rank';
                    const isAction = cell.column.id === 'action';

                    return (
                      <td
                        key={cell.id}
                        className={`p-2 ${align} ${
                          isRank ? `sticky left-0 z-10 ${bg}` : ''
                        } ${isAction ? `sticky right-0 z-10 ${bg}` : ''}`}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RfqDecisionRankingTable;
