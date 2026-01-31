import { Button, Text } from '@ui5/webcomponents-react';

import '@ui5/webcomponents-icons/dist/refresh.js';

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
          <Text>
            <span className="font-['72:Regular',sans-serif] text-xs text-[var(--sapContent_LabelColor)]">
              Last Updated: <span className="font-['72:Semibold_Duplex',sans-serif]">{lastUpdated}</span>
            </span>
          </Text>
        </div>
      )}

      {calculatedAt && (
        <div className="flex items-center gap-1.5">
          <Text>
            <span className="font-['72:Regular',sans-serif] text-xs text-[var(--sapContent_LabelColor)]">
              Calculated At: <span className="font-['72:Semibold_Duplex',sans-serif]">{calculatedAt}</span>
            </span>
          </Text>
        </div>
      )}

      {source && (
        <div className="flex items-center gap-1.5">
          <Text>
            <span className="font-['72:Regular',sans-serif] text-xs text-[var(--sapContent_LabelColor)]">
              Source: <span className="font-['72:Semibold_Duplex',sans-serif]">{source}</span>
            </span>
          </Text>
        </div>
      )}

      {refreshable && onRefresh && (
        <div className="ml-auto">
          <Button icon="refresh" design="Transparent" onClick={onRefresh}>
            Refresh
          </Button>
        </div>
      )}
    </div>
  );
}
