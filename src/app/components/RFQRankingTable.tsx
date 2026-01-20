import { RFQQuote } from '../../data/types';
import { FioriObjectStatus } from './fiori/FioriObjectStatus';
import { FioriButton } from './fiori/FioriButton';
import {
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from 'lucide-react';

type SortField = 'rank' | 'counterparty' | 'spread' | 'buy_price' | 'sell_price' | 'channel' | 'quoted_at';
type SortDirection = 'asc' | 'desc';

interface RFQRankingTableProps {
  quotes: RFQQuote[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  areButtonsEnabled: boolean;
  isAwarded: boolean;
  isSent?: boolean;
  onAward: (quote: RFQQuote) => void;
  onReject: (quote: RFQQuote) => void;
  onRefresh: (quote: RFQQuote) => void;
  formatDateTime: (isoString: string) => string;
  getChannelLabel: (channel: string) => string;
  getChannelColor: (channel: string) => 'positive' | 'critical' | 'neutral' | 'information';
}

export function RFQRankingTable({
  quotes,
  sortField,
  sortDirection,
  onSort,
  areButtonsEnabled,
  isAwarded,
  isSent,
  onAward,
  onReject,
  onRefresh,
  formatDateTime,
  getChannelLabel,
  getChannelColor,
}: RFQRankingTableProps) {
  // For "Sent" status, only show counterparties without prices
  const showPrices = !isSent;

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--sapList_BorderColor)] bg-[var(--sapList_HeaderBackground)]">
            <th className="px-3 py-2 text-left">
              <button
                onClick={() => onSort('rank')}
                className="flex items-center gap-1 font-['72:Semibold_Duplex',sans-serif] text-xs text-[var(--sapList_HeaderTextColor)] hover:text-[var(--sapLink_Hover_Color)] transition-colors"
              >
                Ranking
                <ArrowUpDown className="w-3 h-3" />
              </button>
            </th>
            <th className="px-3 py-2 text-left">
              <button
                onClick={() => onSort('counterparty')}
                className="flex items-center gap-1 font-['72:Semibold_Duplex',sans-serif] text-xs text-[var(--sapList_HeaderTextColor)] hover:text-[var(--sapLink_Hover_Color)] transition-colors"
              >
                Contraparte
                <ArrowUpDown className="w-3 h-3" />
              </button>
            </th>
            {showPrices && (
              <>
                <th className="px-3 py-2 text-right">
                  <button
                    onClick={() => onSort('buy_price')}
                    className="flex items-center gap-1 ml-auto font-['72:Semibold_Duplex',sans-serif] text-xs text-[var(--sapList_HeaderTextColor)] hover:text-[var(--sapLink_Hover_Color)] transition-colors"
                  >
                    Compra
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="px-3 py-2 text-right">
                  <button
                    onClick={() => onSort('sell_price')}
                    className="flex items-center gap-1 ml-auto font-['72:Semibold_Duplex',sans-serif] text-xs text-[var(--sapList_HeaderTextColor)] hover:text-[var(--sapLink_Hover_Color)] transition-colors"
                  >
                    Venda
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="px-3 py-2 text-right">
                  <button
                    onClick={() => onSort('spread')}
                    className="flex items-center gap-1 ml-auto font-['72:Semibold_Duplex',sans-serif] text-xs text-[var(--sapList_HeaderTextColor)] hover:text-[var(--sapLink_Hover_Color)] transition-colors"
                  >
                    Spread
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
              </>
            )}
            <th className="px-3 py-2 text-center">
              <button
                onClick={() => onSort('channel')}
                className="flex items-center gap-1 mx-auto font-['72:Semibold_Duplex',sans-serif] text-xs text-[var(--sapList_HeaderTextColor)] hover:text-[var(--sapLink_Hover_Color)] transition-colors"
              >
                Canal
                <ArrowUpDown className="w-3 h-3" />
              </button>
            </th>
            <th className="px-3 py-2 text-center">
              <button
                onClick={() => onSort('quoted_at')}
                className="flex items-center gap-1 mx-auto font-['72:Semibold_Duplex',sans-serif] text-xs text-[var(--sapList_HeaderTextColor)] hover:text-[var(--sapLink_Hover_Color)] transition-colors"
              >
                Data/Hora
                <ArrowUpDown className="w-3 h-3" />
              </button>
            </th>
            {(areButtonsEnabled || isAwarded) && (
              <th className="px-3 py-2 text-right font-['72:Semibold_Duplex',sans-serif] text-xs text-[var(--sapList_HeaderTextColor)]">
                Ações
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {quotes.map((quote, index) => {
            const isQuoteAwarded = quote.status === 'Awarded';
            const isQuoteRejected = quote.status === 'Rejected';

            return (
              <tr
                key={quote.quote_id}
                className={`border-b border-[var(--sapList_BorderColor)] hover:bg-[var(--sapList_HoverBackground)] transition-colors ${
                  isQuoteAwarded ? 'bg-[var(--sapList_SelectionBackgroundColor)] border-l-2 border-l-[var(--sapPositiveColor)]' : ''
                } ${isQuoteRejected ? 'opacity-60' : ''}`}
              >
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-['72:Bold',sans-serif] text-sm text-[#131e29]">
                      {quote.rank}º
                    </span>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <div className="font-['72:Bold',sans-serif] text-sm text-[#0064d9]">
                    {quote.counterparty}
                  </div>
                  <div className="text-xs text-[var(--sapContent_LabelColor)] font-['72:Regular',sans-serif]">
                    {quote.volume_mt} MT
                  </div>
                </td>
                {showPrices && (
                  <>
                    <td className="px-3 py-3 text-right">
                      <span className="font-['72:Bold',sans-serif] text-sm text-[#131e29]">
                        ${quote.buy_price?.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span className="font-['72:Bold',sans-serif] text-sm text-[#131e29]">
                        ${quote.sell_price?.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span
                        className="font-['72:Bold',sans-serif] text-sm text-[#131e29]"
                      >
                        ${quote.spread?.toFixed(2)}
                      </span>
                    </td>
                  </>
                )}
                <td className="px-3 py-3 text-center">
                  <FioriObjectStatus status={getChannelColor(quote.channel)}>
                    {getChannelLabel(quote.channel)}
                  </FioriObjectStatus>
                </td>
                <td className="px-3 py-3 text-center">
                  <span className="text-xs text-[var(--sapContent_LabelColor)] font-['72:Regular',sans-serif]">
                    {formatDateTime(quote.quoted_at)}
                  </span>
                </td>
                {areButtonsEnabled && (
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {isQuoteAwarded ? (
                        <div className="flex items-center gap-2 text-[var(--sapPositiveTextColor)]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span className="text-xs font-['72:Semibold_Duplex',sans-serif]">
                            Contratado
                          </span>
                        </div>
                      ) : isQuoteRejected ? (
                        <div className="flex items-center gap-2 text-[var(--sapNegativeTextColor)]">
                          <XCircle className="w-3.5 h-3.5" />
                          <span className="text-xs font-['72:Semibold_Duplex',sans-serif]">
                            Recusado
                          </span>
                        </div>
                      ) : (
                        <>
                          <FioriButton
                            variant="positive"
                            icon={<CheckCircle2 className="w-3 h-3" />}
                            onClick={() => onAward(quote)}
                          >
                            Contratar
                          </FioriButton>
                          <FioriButton
                            variant="negative"
                            icon={<XCircle className="w-3 h-3" />}
                            onClick={() => onReject(quote)}
                          >
                            Recusar
                          </FioriButton>
                          <FioriButton
                            variant="ghost"
                            icon={<RefreshCw className="w-3 h-3" />}
                            onClick={() => onRefresh(quote)}
                          >
                            Atualizar
                          </FioriButton>
                        </>
                      )}
                    </div>
                  </td>
                )}
                {isAwarded && !areButtonsEnabled && (
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-end">
                      {isQuoteAwarded && (
                        <div className="flex items-center gap-2 text-[var(--sapPositiveTextColor)]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span className="text-xs font-['72:Semibold_Duplex',sans-serif]">
                            Contratado
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}