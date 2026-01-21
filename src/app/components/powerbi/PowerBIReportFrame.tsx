import { useMemo, useState } from 'react';

import { EmptyState } from '../ui';
import { FioriButton } from '../fiori/FioriButton';
import { ExternalLink, RefreshCw } from 'lucide-react';

export function PowerBIReportFrame({
  baseUrl,
  filter,
  title = 'Power BI',
  className = '',
  storageKey,
}: {
  baseUrl?: string | null;
  filter?: string | null;
  title?: string;
  className?: string;
  storageKey?: string;
}) {
  const [savedBaseUrl, setSavedBaseUrl] = useState<string | null>(() => {
    if (!storageKey) return null;
    try {
      const v = String(localStorage.getItem(storageKey) || '').trim();
      return v ? v : null;
    } catch {
      return null;
    }
  });

  const [draftBaseUrl, setDraftBaseUrl] = useState<string>(savedBaseUrl || '');
  const [showConfig, setShowConfig] = useState<boolean>(false);

  const effectiveBaseUrl = useMemo(() => {
    const envBase = String(baseUrl || '').trim();
    if (envBase) return envBase;
    return savedBaseUrl;
  }, [baseUrl, savedBaseUrl]);

  const normalizedUrl = useMemo(() => {
    const base = String(effectiveBaseUrl || '').trim();
    if (!base) return null;
    const f = String(filter || '').trim();
    if (!f) return base;

    try {
      const u = new URL(base);
      u.searchParams.set('filter', f);
      return u.toString();
    } catch {
      const sep = base.includes('?') ? '&' : '?';
      return `${base}${sep}filter=${encodeURIComponent(f)}`;
    }
  }, [effectiveBaseUrl, filter]);

  const [reloadKey, setReloadKey] = useState(0);

  if (!normalizedUrl) {
    return (
      <div className={`p-6 ${className}`.trim()}>
        <EmptyState title="Relatório Power BI não configurado" description="Configure a URL do embed para exibir o relatório aqui." />

        <div className="mt-4 max-w-[720px]">
          <div className="text-sm text-[var(--sapTextColor)] mb-2">
            Opções de configuração:
          </div>
          <ul className="list-disc pl-5 text-sm text-[var(--sapContent_LabelColor)] space-y-1">
            <li>
              Deploy: defina <span className="font-['72:Bold',sans-serif]">VITE_POWERBI_CASHFLOW_EMBED_URL</span> no ambiente.
            </li>
            {storageKey ? <li>Neste navegador: salve a URL abaixo (fica em localStorage).</li> : null}
          </ul>

          {storageKey ? (
            <div className="mt-4 p-4 rounded border border-[var(--sapTile_BorderColor)] bg-white">
              <div className="text-xs text-[var(--sapContent_LabelColor)] mb-2">URL do embed (iframe src)</div>
              <input
                className="w-full p-2 border border-[var(--sapField_BorderColor)] rounded bg-white text-sm"
                placeholder="https://app.powerbi.com/reportEmbed?…"
                value={draftBaseUrl}
                onChange={(e) => setDraftBaseUrl(e.target.value)}
              />
              <div className="mt-3 flex items-center gap-2">
                <FioriButton
                  variant="emphasized"
                  onClick={() => {
                    const v = String(draftBaseUrl || '').trim();
                    if (!v) return;
                    try {
                      localStorage.setItem(storageKey, v);
                    } catch {
                      // ignore
                    }
                    setSavedBaseUrl(v);
                    setShowConfig(false);
                  }}
                >
                  Salvar
                </FioriButton>
                <FioriButton
                  variant="ghost"
                  onClick={() => {
                    try {
                      localStorage.removeItem(storageKey);
                    } catch {
                      // ignore
                    }
                    setSavedBaseUrl(null);
                    setDraftBaseUrl('');
                  }}
                >
                  Limpar
                </FioriButton>
              </div>
            </div>
          ) : null}
        </div>
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
          {storageKey ? (
            <FioriButton
              variant="ghost"
              onClick={() => {
                setDraftBaseUrl(savedBaseUrl || String(baseUrl || ''));
                setShowConfig((v) => !v);
              }}
            >
              Configurar
            </FioriButton>
          ) : null}
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

      {storageKey && showConfig ? (
        <div className="p-3 border-b border-[var(--sapList_BorderColor)] bg-white">
          <div className="text-xs text-[var(--sapContent_LabelColor)] mb-2">URL do embed (iframe src)</div>
          <div className="flex items-center gap-2">
            <input
              className="flex-1 p-2 border border-[var(--sapField_BorderColor)] rounded bg-white text-sm"
              value={draftBaseUrl}
              onChange={(e) => setDraftBaseUrl(e.target.value)}
            />
            <FioriButton
              variant="emphasized"
              onClick={() => {
                const v = String(draftBaseUrl || '').trim();
                if (!v) return;
                try {
                  localStorage.setItem(storageKey, v);
                } catch {
                  // ignore
                }
                setSavedBaseUrl(v);
                setShowConfig(false);
              }}
            >
              Salvar
            </FioriButton>
          </div>
        </div>
      ) : null}

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
