export function normalizeRoleName(role: unknown): string {
  if (role === null || role === undefined) return '';

  if (typeof role === 'string') {
    const raw = role.trim().toLowerCase();
    return canonicalizeRole(raw);
  }

  if (typeof role === 'number') return String(role);

  if (Array.isArray(role)) {
    return role.length > 0 ? normalizeRoleName(role[0]) : '';
  }

  if (typeof role === 'object') {
    const obj = role as Record<string, unknown>;

    if (typeof obj.name === 'string') return canonicalizeRole(obj.name.trim().toLowerCase());
    if (typeof obj.role === 'string') return canonicalizeRole(obj.role.trim().toLowerCase());
    if (typeof obj.value === 'string') return canonicalizeRole(obj.value.trim().toLowerCase());
    if (typeof obj.code === 'string') return canonicalizeRole(obj.code.trim().toLowerCase());
  }

  try {
    return canonicalizeRole(String(role).trim().toLowerCase());
  } catch {
    return '';
  }
}

function canonicalizeRole(raw: string): string {
  const r = raw.trim().toLowerCase();
  if (!r) return '';

  // Admin
  if (['admin', 'administrator', 'administrador', 'adm', 'sysadmin'].includes(r)) return 'admin';

  // Finance
  if (['financeiro', 'finance', 'financial', 'fin'].includes(r)) return 'financeiro';

  // Audit
  if (['auditoria', 'audit', 'auditor', 'auditoría'].includes(r)) return 'auditoria';

  // Sales / Purchase
  // Consolidated commercial role
  if (['comercial', 'commercial', 'commerce'].includes(r)) return 'comercial';
  if (['vendas', 'sales', 'venda'].includes(r)) return 'comercial';
  if (['compras', 'purchase', 'purchasing', 'compra'].includes(r)) return 'comercial';

  return r;
}
