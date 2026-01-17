import { useMemo, useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import svgPaths from '../../../imports/svg-fgw0vx83tp';

import {
  isQuickSearchEligible,
  quickSearchAll,
  type QuickSearchResults,
} from '../../../services/quickSearch.service';

// Placeholder for Figma assets - replace with actual images
const imgAlcastLogo = '/assets/alcast-logo.png';
const imgAvatar = '/assets/avatar.png';

interface FioriShellBarProps {
  onMenuToggle: () => void;
  sidebarOpen?: boolean;
  applicationName?: string;
  userName?: string;
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p56ff0} fill="var(--fill-0, #131E29)" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function ShellIconButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center min-h-[36px] p-[10px] relative rounded-[8px] shrink-0 hover:bg-[#eff1f2] transition-colors cursor-pointer border-0"
      aria-label="Toggle menu"
    >
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Icon />
    </button>
  );
}

function HamburgerButton({ onToggle }: { onToggle: () => void }) {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Hamburger Button">
      <ShellIconButton onClick={onToggle} />
    </div>
  );
}

function Logo() {
  return (
    <div className="content-stretch flex flex-col h-[32px] items-start px-[4px] py-px relative shrink-0" data-name="Logo">
      <div className="h-[30px] max-h-[32px] relative shrink-0 w-[100px]" data-name="Alcast_Logo">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img 
            alt="Alcast Logo" 
            className="absolute h-full left-0 max-w-none top-0 w-full object-contain" 
            src={imgAlcastLogo} 
          />
        </div>
      </div>
    </div>
  );
}

function BrandingButton() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[4px] items-center justify-center pl-[4px] pr-[8px] py-[2px] relative rounded-[8px] shrink-0 hover:bg-[#eff1f2] transition-colors cursor-pointer" data-name="Branding Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Logo />
      <p className="font-['72:Semibold_Duplex',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#003e87] text-[16px] text-nowrap">Hedge Management</p>
    </div>
  );
}

function ChevronDownIcon() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="ChevronDown">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p1663edb0} fill="var(--fill-0, #131E29)" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

interface MenuItem {
  label: string;
  path: string;
  category?: string;
}

function MenuButton() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  const menuItems: MenuItem[] = [
    { label: 'Dashboard', path: '/', category: 'Principal' },
    { label: 'Sales Orders', path: '/vendas/sales-orders', category: 'Vendas' },
    { label: 'Purchase Orders', path: '/compras/purchase-orders', category: 'Compras' },
    { label: 'Exposições', path: '/financeiro/exposicoes', category: 'Financeiro' },
    { label: 'RFQs', path: '/financeiro/rfqs', category: 'Financeiro' },
    { label: 'Contratos', path: '/financeiro/contratos', category: 'Financeiro' },
    { label: 'Deals', path: '/financeiro/deals', category: 'Financeiro' },
    { label: 'MTM Snapshots', path: '/mercado/mtm', category: 'Mercado' },
    { label: 'Settlements', path: '/mercado/settlements', category: 'Mercado' },
    { label: 'Configurações', path: '/configuracoes', category: 'Sistema' },
  ];

  const currentPage = menuItems.find(item => item.path === location.pathname);
  const displayName = currentPage?.label || 'Dashboard';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div ref={menuRef} className="relative" data-name="Menu Button">
      {isOpen ? (
        <button
          onClick={() => setIsOpen(false)}
          className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[6px] items-center justify-center px-[12px] py-[6px] relative rounded-[8px] shrink-0 hover:bg-[#eff1f2] transition-colors cursor-pointer border-0 h-[36px]"
          aria-expanded="true"
          aria-haspopup="true"
        >
          <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
          <span className="font-['72:Regular',sans-serif] text-[14px] text-[#131e29] text-nowrap">{displayName}</span>
          <ChevronDownIcon />
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[6px] items-center justify-center px-[12px] py-[6px] relative rounded-[8px] shrink-0 hover:bg-[#eff1f2] transition-colors cursor-pointer border-0 h-[36px]"
          aria-expanded="false"
          aria-haspopup="true"
        >
          <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
          <span className="font-['72:Regular',sans-serif] text-[14px] text-[#131e29] text-nowrap">{displayName}</span>
          <ChevronDownIcon />
        </button>
      )}

      {isOpen && (
        <div 
          className="absolute top-[calc(100%+4px)] left-0 bg-white rounded-[8px] shadow-[0_4px_16px_rgba(0,0,0,0.12)] min-w-[240px] z-[1100] overflow-hidden border border-[#d9d9d9]"
        >
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            const showCategory = index === 0 || menuItems[index - 1]?.category !== item.category;

            return (
              <div key={item.path}>
                {showCategory && item.category && (
                  <div className="px-[12px] py-[6px] bg-[#f7f7f7] border-b border-[#e5e5e5]">
                    <span className="font-['72:Bold',sans-serif] text-[12px] text-[#556b82] uppercase tracking-wide">
                      {item.category}
                    </span>
                  </div>
                )}
                <button
                  onClick={() => handleMenuItemClick(item.path)}
                  className={`w-full px-[16px] py-[10px] text-left font-['72:Regular',sans-serif] text-[14px] transition-colors border-0 ${
                    isActive 
                      ? 'bg-[#e3f0ff] text-[#0064d9] font-["72:Semibold",sans-serif]' 
                      : 'text-[#131e29] hover:bg-[#f7f7f7]'
                  }`}
                >
                  {item.label}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function LeftArea({ onMenuToggle }: { onMenuToggle: () => void }) {
  return (
    <div className="content-stretch flex gap-[8px] h-[52px] items-center relative shrink-0" data-name="Left Area">
      <HamburgerButton onToggle={onMenuToggle} />
      <BrandingButton />
      <MenuButton />
    </div>
  );
}

function SearchIcon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p376bb880} fill="var(--fill-0, #131E29)" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function ShellButton() {
  return (
    <button
      className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[6px] items-center justify-center min-h-[26px] px-[8px] py-[5px] relative rounded-[17px] shrink-0 w-[28px] hover:bg-[#d9d9d9] transition-colors cursor-pointer border-0"
      data-name="Shell Button"
      aria-label="Buscar"
      title="Buscar"
      type="button"
    >
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[17px]" />
      <SearchIcon />
    </button>
  );
}

function ShellSearch() {
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<QuickSearchResults>({
    customers: [],
    counterparties: [],
    suppliers: [],
    contracts: [],
    deals: [],
  });

  const eligible = useMemo(() => isQuickSearchEligible(query), [query]);
  const hasAnyResults =
    results.customers.length > 0 ||
    results.counterparties.length > 0 ||
    results.suppliers.length > 0 ||
    results.contracts.length > 0 ||
    results.deals.length > 0;

  const requestSeq = useRef(0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setLoading(false);
      setResults({ customers: [], counterparties: [], suppliers: [], contracts: [], deals: [] });
      return;
    }

    if (!eligible) {
      setLoading(false);
      setResults({ customers: [], counterparties: [], suppliers: [], contracts: [], deals: [] });
      return;
    }

    const seq = ++requestSeq.current;
    setLoading(true);
    const timer = window.setTimeout(async () => {
      try {
        const data = await quickSearchAll(q, 6);
        if (requestSeq.current === seq) {
          setResults(data);
          setOpen(true);
        }
      } finally {
        if (requestSeq.current === seq) {
          setLoading(false);
        }
      }
    }, 250);

    return () => window.clearTimeout(timer);
  }, [query, eligible]);

  const goTo = (path: string, params?: Record<string, string | number | undefined | null>) => {
    const q = query.trim();
    const searchParams = new URLSearchParams();
    if (q) searchParams.set('q', q);
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        if (v === undefined || v === null || v === '') continue;
        searchParams.set(k, String(v));
      }
    }
    const qs = searchParams.toString();
    navigate(qs ? `${path}?${qs}` : path);
    setOpen(false);
  };

  const goToFirstResult = () => {
    if (results.customers.length) return goTo('/vendas/clientes', { id: results.customers[0].id });
    if (results.counterparties.length)
      return goTo('/financeiro/contrapartes', { id: results.counterparties[0].id });
    if (results.suppliers.length)
      return goTo('/compras/fornecedores', { id: results.suppliers[0].id });
    if (results.contracts.length)
      return goTo('/financeiro/contratos', { id: results.contracts[0].contract_id });
    if (results.deals.length) return goTo(`/financeiro/deals/${results.deals[0].id}`);
    return null;
  };

  const hasFirstResult = useMemo(() => {
    return (
      results.customers.length > 0 ||
      results.counterparties.length > 0 ||
      results.suppliers.length > 0 ||
      results.contracts.length > 0 ||
      results.deals.length > 0
    );
  }, [results]);

  return (
    <div ref={rootRef} className="relative" data-name="Shell Search Root">
      <div className="bg-[#eff1f2] content-stretch flex gap-[4px] h-[36px] items-center justify-end max-w-[576px] min-w-[288px] overflow-clip pl-[14px] pr-[4px] py-[4px] relative rounded-[18px] shrink-0 w-[400px]" data-name="Shell Search">
        <input
          type="text"
          placeholder="Search"
            aria-label="Busca"
            title="Busca"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (eligible && (hasAnyResults || loading)) setOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setOpen(false);
            }

            if (e.key === 'Enter') {
              if (!eligible) return;
              if (hasFirstResult) {
                goToFirstResult();
              } else {
                setOpen(true);
              }
            }
          }}
          className="basis-0 flex flex-col font-['72:Regular',sans-serif] grow h-[16px] justify-center leading-[0] min-h-px min-w-px overflow-ellipsis overflow-hidden relative shrink-0 text-[#131e29] text-[14px] text-nowrap bg-transparent border-0 outline-none placeholder:text-[#556b82] placeholder:italic"
        />
        <button
          type="button"
          onClick={() => {
            if (!eligible) {
              setOpen(true);
              return;
            }
            if (hasFirstResult) {
              goToFirstResult();
              return;
            }

            setOpen(true);
          }}
          className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[6px] items-center justify-center min-h-[26px] px-[8px] py-[5px] relative rounded-[17px] shrink-0 w-[28px] hover:bg-[#d9d9d9] transition-colors cursor-pointer border-0"
          aria-label="Search"
        >
          <SearchIcon />
        </button>
        <div className="absolute bottom-0 h-0 left-0 right-0" data-name="Underline">
          <div
            className="absolute inset-[-1px_0_0_0] sap-stroke-underline"
          >
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 400 1">
              <line id="Underline" stroke="var(--stroke-0, #556B81)" x2="400" y1="0.5" y2="0.5" />
            </svg>
          </div>
        </div>
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0px_0px_0px_1px_rgba(85,107,129,0.25)] rounded-[18px]" />
      </div>

      {open && (
        <div
          className="absolute top-[calc(100%+6px)] left-0 w-[400px] bg-white rounded-[10px] shadow-[0_8px_24px_rgba(0,0,0,0.16)] z-[1200] overflow-hidden border border-[#d9d9d9]"
          role="listbox"
          aria-label="Resultados de busca"
          title="Resultados de busca"
        >
          {!eligible ? (
            <div className="px-4 py-3 text-[13px] text-[#556b82] font-['72:Regular',sans-serif]">
              Digite pelo menos <span className="font-['72:Bold',sans-serif]">3 letras</span> ou <span className="font-['72:Bold',sans-serif]">4 números</span>.
            </div>
          ) : loading ? (
            <div className="px-4 py-3 text-[13px] text-[#556b82] font-['72:Regular',sans-serif]">Buscando…</div>
          ) : !hasAnyResults ? (
            <div className="px-4 py-3 text-[13px] text-[#556b82] font-['72:Regular',sans-serif]">Sem resultados.</div>
          ) : (
            <div className="max-h-[360px] overflow-auto">
              {results.customers.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-[#f7f7f7] border-b border-[#e5e5e5]">
                    <span className="font-['72:Bold',sans-serif] text-[12px] text-[#556b82] uppercase tracking-wide">Clientes</span>
                  </div>
                  {results.customers.map((c) => (
                    <button
                      key={`customer-${c.id}`}
                      onClick={() => goTo('/vendas/clientes', { id: c.id })}
                      className="w-full px-4 py-2 text-left hover:bg-[#f7f7f7] border-0 bg-transparent"
                      role="option"
                    >
                      <div className="text-[14px] text-[#131e29] font-['72:Regular',sans-serif]">{c.name}</div>
                      <div className="text-[12px] text-[#556b82] font-['72:Regular',sans-serif]">
                        {c.tax_id ? `Tax ID: ${c.tax_id}` : c.contact_email || ''}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {results.counterparties.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-[#f7f7f7] border-y border-[#e5e5e5]">
                    <span className="font-['72:Bold',sans-serif] text-[12px] text-[#556b82] uppercase tracking-wide">Contrapartes</span>
                  </div>
                  {results.counterparties.map((cp) => (
                    <button
                      key={`counterparty-${cp.id}`}
                      onClick={() => goTo('/financeiro/contrapartes', { id: cp.id })}
                      className="w-full px-4 py-2 text-left hover:bg-[#f7f7f7] border-0 bg-transparent"
                      role="option"
                    >
                      <div className="text-[14px] text-[#131e29] font-['72:Regular',sans-serif]">{cp.name}</div>
                      <div className="text-[12px] text-[#556b82] font-['72:Regular',sans-serif]">
                        {cp.tax_id ? `Tax ID: ${cp.tax_id}` : cp.contact_email || ''}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {results.suppliers.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-[#f7f7f7] border-y border-[#e5e5e5]">
                    <span className="font-['72:Bold',sans-serif] text-[12px] text-[#556b82] uppercase tracking-wide">Fornecedores</span>
                  </div>
                  {results.suppliers.map((s) => (
                    <button
                      key={`supplier-${s.id}`}
                      onClick={() => goTo('/compras/fornecedores', { id: s.id })}
                      className="w-full px-4 py-2 text-left hover:bg-[#f7f7f7] border-0 bg-transparent"
                      role="option"
                    >
                      <div className="text-[14px] text-[#131e29] font-['72:Regular',sans-serif]">{s.name}</div>
                      <div className="text-[12px] text-[#556b82] font-['72:Regular',sans-serif]">
                        {s.tax_id ? `Tax ID: ${s.tax_id}` : s.contact_email || ''}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {results.contracts.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-[#f7f7f7] border-y border-[#e5e5e5]">
                    <span className="font-['72:Bold',sans-serif] text-[12px] text-[#556b82] uppercase tracking-wide">Contratos</span>
                  </div>
                  {results.contracts.map((c) => (
                    <button
                      key={`contract-${c.contract_id}`}
                      onClick={() => goTo('/financeiro/contratos', { id: c.contract_id })}
                      className="w-full px-4 py-2 text-left hover:bg-[#f7f7f7] border-0 bg-transparent"
                      role="option"
                    >
                      <div className="text-[14px] text-[#131e29] font-['72:Regular',sans-serif]">{c.contract_id}</div>
                      <div className="text-[12px] text-[#556b82] font-['72:Regular',sans-serif]">
                        {c.quote_group_id ? `Quote Group: ${c.quote_group_id}` : `Deal: ${c.deal_id} • RFQ: ${c.rfq_id}`}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {results.deals.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-[#f7f7f7] border-y border-[#e5e5e5]">
                    <span className="font-['72:Bold',sans-serif] text-[12px] text-[#556b82] uppercase tracking-wide">Deals</span>
                  </div>
                  {results.deals.map((d) => (
                    <button
                      key={`deal-${d.id}`}
                      onClick={() => goTo(`/financeiro/deals/${d.id}`)}
                      className="w-full px-4 py-2 text-left hover:bg-[#f7f7f7] border-0 bg-transparent"
                      role="option"
                    >
                      <div className="text-[14px] text-[#131e29] font-['72:Regular',sans-serif]">
                        {d.reference_name || d.deal_uuid}
                      </div>
                      <div className="text-[12px] text-[#556b82] font-['72:Regular',sans-serif]">
                        {d.commodity ? `Commodity: ${d.commodity}` : `ID: ${d.id}`}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function NotificationIcon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p2f6100} fill="var(--fill-0, #131E29)" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function NotificationButton() {
  return (
    <button
      className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center min-h-[36px] p-[10px] relative rounded-[8px] shrink-0 hover:bg-[#eff1f2] transition-colors cursor-pointer border-0"
      data-name="Notification Button"
      type="button"
      aria-label="Notificações"
      title="Notificações"
    >
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <NotificationIcon />
    </button>
  );
}

function HelpIcon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_1_45392)" id="Icon">
          <path d={svgPaths.p29415600} fill="var(--fill-0, #131E29)" id="Icon_2" />
        </g>
        <defs>
          <clipPath id="clip0_1_45392">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function HelpButton() {
  return (
    <button
      className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center min-h-[36px] p-[10px] relative rounded-[8px] shrink-0 hover:bg-[#eff1f2] transition-colors cursor-pointer border-0"
      data-name="Help Button"
      type="button"
      aria-label="Ajuda"
      title="Ajuda"
    >
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <HelpIcon />
    </button>
  );
}

function OverflowIcon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pe8dd800} fill="var(--fill-0, #131E29)" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function OverflowButton() {
  return (
    <button
      className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center min-h-[36px] p-[10px] relative rounded-[8px] shrink-0 hover:bg-[#eff1f2] transition-colors cursor-pointer border-0"
      data-name="Overflow Button"
      type="button"
      aria-label="Mais opções"
      title="Mais opções"
    >
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <OverflowIcon />
    </button>
  );
}

function Avatar({ userName }: { userName?: string }) {
  return (
    <button 
      className="content-stretch flex gap-[10px] items-start max-h-[32px] max-w-[32px] relative rounded-[100px] shrink-0 hover:opacity-80 transition-opacity cursor-pointer border-0 p-0 bg-transparent" 
      data-name="Avatar"
      title={userName || 'User'}
    >
      <img 
        alt={userName || 'User avatar'} 
        className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[100px] size-full" 
        src={imgAvatar} 
      />
    </button>
  );
}

function RightArea({ userName }: { userName?: string }) {
  return (
    <div className="content-stretch flex gap-[8px] items-center justify-end relative shrink-0" data-name="Right Area">
      <ShellSearch />
      <NotificationButton />
      <HelpButton />
      <OverflowButton />
      <Avatar userName={userName} />
    </div>
  );
}

export function FioriShellBar({ onMenuToggle, sidebarOpen, applicationName = 'Hedge Management', userName }: FioriShellBarProps) {
  return (
    <div className="bg-white w-full relative shrink-0 z-[1000]" data-name="Shell Bar">
      <div className="content-stretch flex items-center justify-between max-w-[inherit] min-w-[inherit] overflow-visible pl-[14px] pr-[16px] py-0 relative rounded-[inherit] w-full">
        <LeftArea onMenuToggle={onMenuToggle} />
        <RightArea userName={userName} />
      </div>
      <div aria-hidden="true" className="absolute border-[#d9d9d9] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}