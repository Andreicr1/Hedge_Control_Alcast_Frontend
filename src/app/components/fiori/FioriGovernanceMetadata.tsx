import { Clock, Database, RefreshCw } from 'lucide-react';

interface FioriGovernanceMetadataProps {
  lastUpdated?: string;
  calculatedAt?: string;
  source?: string;
  refreshable?: boolean;
  onRefresh?: () => void;
}

/**
 * Governance Metadata Component - Enterprise Grade
 * Exibe informações de auditoria, timestamp e source of data
 */
export function FioriGovernanceMetadata({
  lastUpdated,
  calculatedAt,
  source,
  refreshable = false,
  onRefresh,
}: FioriGovernanceMetadataProps) {
  return (
    <div className="bg-[var(--sapInfobar_Background,#fafafa)] border border-[var(--sapList_BorderColor)] rounded px-3 py-2 flex items-center gap-4 flex-wrap">
      {lastUpdated && (
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[var(--sapContent_IconColor)] opacity-70" />
          <span className="font-['72:Regular',sans-serif] text-xs text-[var(--sapContent_LabelColor)]">
            Last Updated: <span className="font-['72:Semibold_Duplex',sans-serif]">{lastUpdated}</span>
          </span>
        </div>
      )}

      {calculatedAt && (
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[var(--sapContent_IconColor)] opacity-70" />
          <span className="font-['72:Regular',sans-serif] text-xs text-[var(--sapContent_LabelColor)]">
            Calculated At: <span className="font-['72:Semibold_Duplex',sans-serif]">{calculatedAt}</span>
          </span>
        </div>
      )}

      {source && (
        <div className="flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-[var(--sapContent_IconColor)] opacity-70" />
          <span className="font-['72:Regular',sans-serif] text-xs text-[var(--sapContent_LabelColor)]">
            Source: <span className="font-['72:Semibold_Duplex',sans-serif]">{source}</span>
          </span>
        </div>
      )}

      {refreshable && onRefresh && (
        <button
          onClick={onRefresh}
          className="ml-auto flex items-center gap-1 px-2 py-1 text-xs font-['72:Regular',sans-serif] text-[var(--sapButton_TextColor)] bg-[var(--sapButton_Background)] border border-[var(--sapButton_BorderColor)] rounded hover:bg-[var(--sapButton_Hover_Background)] transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          Refresh
        </button>
      )}
    </div>
  );
}
