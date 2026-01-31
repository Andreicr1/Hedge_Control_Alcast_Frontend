import { useMemo } from 'react';
import { AnalyticalTable, Button } from '@ui5/webcomponents-react';
import { FioriHeaderCard } from '../fiori';
import type { RfqQuote } from '../../../types';
import { formatNumber } from '../../../services/dashboard.service';

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

  if (!rows.length) return null;

  return (
    <FioriHeaderCard title="Ranking de Cotações">
      <AnalyticalTable
        columns={[
          {
            Header: 'Rank',
            accessor: 'rank',
            width: 80,
            Cell: ({ cell }: any) => <span style={{ fontWeight: 700 }}>{String(cell.value)}º</span>,
          },
          {
            Header: 'Contraparte',
            accessor: 'counterpartyName',
            width: 240,
            Cell: ({ row }: any) => {
              const isSelected = !!row.original?.isSelected;
              const name = String(row.original?.counterpartyName || '—');
              return (
                <div>
                  <div style={{ fontWeight: isSelected ? 700 : 400 }}>{name}</div>
                  {isSelected ? <div style={{ opacity: 0.75, fontSize: '0.75rem' }}>Selecionada</div> : null}
                </div>
              );
            },
          },
          { Header: 'Compra', accessor: 'buyPrice', hAlign: 'End', width: 140, Cell: ({ cell }: any) => formatNumber(cell.value ?? null, 2) },
          { Header: 'Venda', accessor: 'sellPrice', hAlign: 'End', width: 140, Cell: ({ cell }: any) => formatNumber(cell.value ?? null, 2) },
          {
            Header: 'Diferença',
            accessor: 'spread',
            hAlign: 'End',
            width: 140,
            Cell: ({ row }: any) => {
              const v = row.original?.spread ?? null;
              const emphasize = !!row.original?.isBest || !!row.original?.isSelected;
              return <span style={{ fontWeight: emphasize ? 700 : 400 }}>{formatNumber(v, 2)}</span>;
            },
          },
          {
            Header: 'Ação',
            accessor: 'action',
            width: 140,
            Cell: ({ row }: any) => {
              if (!canSelect) return null;
              const quote: RfqQuote | null = row.original?.selectQuote ?? null;
              const disabled = isSelectionDisabled || !quote || !onSelect;
              return (
                <Button design="Transparent" disabled={disabled} onClick={() => quote && onSelect?.(quote)}>
                  Selecionar
                </Button>
              );
            },
          },
        ]}
        data={rows}
        visibleRows={Math.min(8, rows.length)}
        minRows={Math.min(8, rows.length)}
      />
    </FioriHeaderCard>
  );
}

export default RfqDecisionRankingTable;
