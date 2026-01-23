import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../components/AuthProvider';
import { getMissingEntraEnvVars } from '../../services/entra.service';

export function LoginPageIntegrated() {
  const navigate = useNavigate();
  const auth = useAuthContext();
  const missingEntra = auth.authMode === 'entra' ? getMissingEntraEnvVars() : [];

  const [email, setEmail] = useState(import.meta.env.DEV ? 'admin@alcast.local' : '');
  const [password, setPassword] = useState(import.meta.env.DEV ? '123' : '');
  const [localError, setLocalError] = useState<string | null>(null);

  const devPresets = useMemo(() => {
    const enabled = import.meta.env.DEV;
    if (!enabled) return [] as Array<{ label: string; email: string; password: string }>;
    return [
      { label: 'Admin', email: 'admin@alcast.local', password: '123' },
      { label: 'Financeiro', email: 'financeiro@alcast.dev', password: '123' },
      { label: 'Comercial (alias compras)', email: 'compras@alcast.dev', password: '123' },
      { label: 'Comercial (alias vendas)', email: 'vendas@alcast.dev', password: '123' },
    ];
  }, []);

  return (
    <div className="min-h-screen bg-[var(--sapBackgroundColor)] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="font-['72:Bold',sans-serif] text-xl text-[#131e29] mb-2">Acesso ao Sistema</h1>
        <p className="text-sm text-[var(--sapContent_LabelColor)] mb-6">
          Informe suas credenciais para entrar.
        </p>

        {devPresets.length > 0 && (
          <div className="mb-4">
            <div className="text-xs text-[var(--sapContent_LabelColor)] mb-2">Acesso rápido (dev)</div>
            <div className="flex gap-2 flex-wrap">
              {devPresets.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  className="px-3 py-1.5 rounded border border-[var(--sapUiBorderColor,#d9d9d9)] text-sm hover:bg-[var(--sapList_HoverBackground)]"
                  onClick={() => {
                    setEmail(p.email);
                    setPassword(p.password);
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {auth.authMode === 'entra' ? (
          <div className="space-y-3">
            {(localError || auth.error) && (
              <div className="p-3 rounded bg-[var(--sapErrorBackground,#ffebeb)] text-[var(--sapNegativeColor,#b00)] text-sm">
                {localError || auth.error}
              </div>
            )}

            {missingEntra.length > 0 && (
              <div className="p-3 rounded bg-[var(--sapErrorBackground,#ffebeb)] text-[var(--sapNegativeColor,#b00)] text-sm">
                Configuração de login Microsoft incompleta: {missingEntra.join(', ')}
              </div>
            )}

            <button
              type="button"
              disabled={auth.isLoading || missingEntra.length > 0}
              className="w-full mt-2 px-4 py-2 bg-[var(--sapButton_Emphasized_Background)] text-white rounded hover:bg-[var(--sapButton_Emphasized_Hover_Background)] disabled:opacity-60"
              onClick={async () => {
                setLocalError(null);
                try {
                  await auth.loginEntra();
                  navigate('/', { replace: true });
                } catch (err) {
                  setLocalError(
                    err instanceof Error ? err.message : 'Não foi possível concluir o login.'
                  );
                }
              }}
            >
              {auth.isLoading ? 'Abrindo login...' : 'Entrar com Microsoft'}
            </button>

            <div className="text-xs text-[var(--sapContent_LabelColor)]">
              Use sua conta corporativa para acessar.
            </div>
          </div>
        ) : (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setLocalError(null);
              try {
                await auth.login({ email, password });
                navigate('/', { replace: true });
              } catch (err) {
                setLocalError(
                  err instanceof Error ? err.message : 'Não foi possível concluir o login.'
                );
              }
            }}
            className="space-y-3"
          >
          <label className="block text-xs text-[var(--sapContent_LabelColor)]">
            Email
            <input
              className="mt-1 w-full p-2 border border-[var(--sapField_BorderColor)] rounded bg-white text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
          </label>

          <label className="block text-xs text-[var(--sapContent_LabelColor)]">
            Senha
            <input
              type="password"
              className="mt-1 w-full p-2 border border-[var(--sapField_BorderColor)] rounded bg-white text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>

          {(localError || auth.error) && (
            <div className="p-3 rounded bg-[var(--sapErrorBackground,#ffebeb)] text-[var(--sapNegativeColor,#b00)] text-sm">
              {localError || auth.error}
            </div>
          )}

          <button
            type="submit"
            disabled={auth.isLoading}
            className="w-full mt-2 px-4 py-2 bg-[var(--sapButton_Emphasized_Background)] text-white rounded hover:bg-[var(--sapButton_Emphasized_Hover_Background)] disabled:opacity-60"
          >
            {auth.isLoading ? 'Entrando...' : 'Entrar'}
          </button>
          </form>
        )}
      </div>
    </div>
  );
}
