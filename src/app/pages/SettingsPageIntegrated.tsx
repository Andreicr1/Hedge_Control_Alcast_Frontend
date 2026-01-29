import { useMemo } from 'react';
import { useAuthContext } from '../components/AuthProvider';
import { normalizeRoleName } from '../../utils/role';

function Badge({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs border bg-[var(--sapNeutralBackground,#f5f6f7)] border-[var(--sapUiBorderColor,#d9d9d9)] text-[var(--sapTextColor,#131e29)]">
      {children}
    </span>
  );
}

export function SettingsPageIntegrated() {
  const { user } = useAuthContext();
  const role = normalizeRoleName(user?.role);

  const apiBaseUrl = useMemo(() => import.meta.env.VITE_API_BASE_URL || '/api', []);

  return (
    <div className="sap-fiori-page p-4">
      <div className="bg-[var(--sapPageHeader_Background)] border-b border-[var(--sapPageHeader_BorderColor)] -mx-4 -mt-4 px-4 py-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-['72:Bold',sans-serif] text-xl text-[var(--sapTextColor,#131e29)]">Configurações</h1>
            <p className="text-sm text-[var(--sapContent_LabelColor,#556b82)] mt-1">
              Informações de ambiente e perfil (somente leitura).
            </p>
          </div>
          {role === 'auditoria' && <Badge>Somente leitura</Badge>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="sap-fiori-section">
          <div className="sap-fiori-section-content">
            <div className="text-sm font-['72:Bold',sans-serif] mb-2">Perfil</div>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[var(--sapContent_LabelColor,#556b82)]">Usuário</span>
                <span className="text-[var(--sapTextColor,#131e29)]">{user?.name || '—'}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[var(--sapContent_LabelColor,#556b82)]">Email</span>
                <span className="text-[var(--sapTextColor,#131e29)]">{user?.email || '—'}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[var(--sapContent_LabelColor,#556b82)]">Perfil</span>
                <span className="text-[var(--sapTextColor,#131e29)]">{role || '—'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="sap-fiori-section">
          <div className="sap-fiori-section-content">
            <div className="text-sm font-['72:Bold',sans-serif] mb-2">Ambiente</div>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[var(--sapContent_LabelColor,#556b82)]">Integração</span>
                <span className="text-[var(--sapTextColor,#131e29)]">Backend</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[var(--sapContent_LabelColor,#556b82)]">API</span>
                <span className="text-[var(--sapTextColor,#131e29)]">{apiBaseUrl}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
