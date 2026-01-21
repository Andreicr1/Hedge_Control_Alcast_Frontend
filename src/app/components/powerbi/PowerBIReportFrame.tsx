import { useMemo, useState } from 'react';

import { EmptyState } from '../ui';
import { FioriButton } from '../fiori/FioriButton';
import { ExternalLink, RefreshCw } from 'lucide-react';

export function PowerBIReportFrame({
  embedUrl,
  title = 'Power BI',
  className = '',
}: {
  embedUrl?: string | null;
  title?: string;
  className?: string;
}) {
  const normalizedUrl = useMemo(() => {
    const u = String(embedUrl || '').trim();
    return u ? u : null;
  }, [embedUrl]);

  const [reloadKey, setReloadKey] = useState(0);

  if (!normalizedUrl) {
    return (
      <div className={`p-6 ${className}`.trim()}>
        <EmptyState
          title="Relatório Power BI não configurado"
          description="Defina VITE_POWERBI_CASHFLOW_EMBED_URL para exibir o relatório aqui."
        />
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full min-h-[520px] ${className}`.trim()}>
      <div className="flex items-center justify-between gap-2 p-3 border-b border-[var(--sapList_BorderColor)] bg-[var(--sapGroup_ContentBackground)]">
        <div className="text-sm font-['72:Bold',sans-serif] text-[var(--sapTextColor)] truncate">
          {title}
        </div>
        <div className="flex items-center gap-2">
          <FioriButton
            variant="ghost"
            icon={<RefreshCw className="w-4 h-4" />}
            onClick={() => setReloadKey(reloadKey + 1)}
          >
            Recarregar
          </FioriButton>
          <a href={normalizedUrl} target="_blank" rel="noreferrer">
            <FioriButton variant="ghost" icon={<ExternalLink className="w-4 h-4" />}>
              Abrir
            </FioriButton>
          </a>
        </div>
      </div>

      <div className="flex-1 min-h-[480px]">
        <iframe
          key={reloadKey}
          title={title}
          src={normalizedUrl}
          className="w-full h-full"
          style={{ border: 0 }}
          allowFullScreen
          // Power BI needs scripts and same-origin for its embed runtime.
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads allow-top-navigation-by-user-activation"
        />
      </div>
    </div>
  );
}

export default PowerBIReportFrame;
