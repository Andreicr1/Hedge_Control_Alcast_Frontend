import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../components/AuthProvider';
import { getMissingEntraEnvVars } from '../../services/entra.service';

export function LoginPageIntegrated() {
  const auth = useAuthContext();
  const missingEntra = getMissingEntraEnvVars();

  if (!auth.isLoading && auth.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-[var(--sapBackgroundColor)] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="font-['72:Bold',sans-serif] text-xl text-[#131e29] mb-2">
          Acesso ao Sistema
        </h1>

        <p className="text-sm text-[var(--sapContent_LabelColor)] mb-6">
          Autenticação via conta corporativa Microsoft.
        </p>

        {(auth.error || missingEntra.length > 0) && (
          <div className="p-3 mb-4 rounded bg-[var(--sapErrorBackground,#ffebeb)] text-[var(--sapNegativeColor,#b00)] text-sm">
            {missingEntra.length > 0
              ? `Configuração Entra incompleta: ${missingEntra.join(', ')}`
              : auth.error}
          </div>
        )}

        <button
          type="button"
          disabled={auth.isLoading || missingEntra.length > 0}
          className="w-full px-4 py-2 bg-[var(--sapButton_Emphasized_Background)] text-white rounded hover:bg-[var(--sapButton_Emphasized_Hover_Background)] disabled:opacity-60"
          onClick={() => auth.loginEntra()}
        >
          {auth.isLoading ? 'Redirecionando...' : 'Entrar com Microsoft'}
        </button>

        <p className="text-xs text-[var(--sapContent_LabelColor)] mt-4 text-center">
          Use sua conta corporativa para acessar.
        </p>
      </div>
    </div>
  );
}
