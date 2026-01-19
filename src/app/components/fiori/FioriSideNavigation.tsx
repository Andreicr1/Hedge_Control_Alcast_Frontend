import { useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { normalizeRoleName } from '../../../utils/role';
import svgPaths from '../../../imports/svg-usjkinc271';
import svgPathsSalesOrder from '../../../imports/svg-4ordkfl4w2';
import svgPathsCustomerOrder from '../../../imports/svg-1jb7ph01kc';
import svgPathsPaidLeave from '../../../imports/svg-jmreoh7plc';
import { UX_COPY } from '../../ux/copy';

interface NavItem {
  label: string;
  path: string;
  icon: ReactNode;
  children?: { label: string; path: string }[];
}

interface FioriSideNavigationProps {
  isOpen: boolean;
  userRole?: string;
}

// Navigation Icons using SVG paths from Figma
function HomeIcon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_home)" id="Icon">
          <path d={svgPaths.p1b28d080} fill="var(--fill-0, #131E29)" id="Icon_2" />
        </g>
        <defs>
          <clipPath id="clip0_home">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function SalesOrderIcon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="sales-order">
          <g id="Icon">
            <path clipRule="evenodd" d={svgPathsSalesOrder.p49d8500} fill="var(--fill-0, #131E29)" fillRule="evenodd" />
            <path d={svgPathsSalesOrder.p96532c0} fill="var(--fill-0, #131E29)" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function CustomerOrderIcon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_customer_order)" id="customer-order-entry">
          <g id="Icon">
            <path clipRule="evenodd" d={svgPathsCustomerOrder.p33334a40} fill="var(--fill-0, #131E29)" fillRule="evenodd" />
            <path d={svgPathsCustomerOrder.p1e5c2e00} fill="var(--fill-0, #131E29)" />
            <path d={svgPathsCustomerOrder.p1d474b00} fill="var(--fill-0, #131E29)" />
            <path clipRule="evenodd" d={svgPathsCustomerOrder.p11b14f70} fill="var(--fill-0, #131E29)" fillRule="evenodd" />
            <path d={svgPathsCustomerOrder.p15b4d560} fill="var(--fill-0, #131E29)" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_customer_order">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function PaidLeaveIcon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_paid_leave)" id="paid-leave">
          <path d={svgPathsPaidLeave.p2fe12180} fill="var(--fill-0, #131E29)" id="Icon" />
        </g>
        <defs>
          <clipPath id="clip0_paid_leave">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function PurchaseIcon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_purchase)" id="Icon">
          <g id="Icon_2">
            <path d={svgPaths.p23c89d00} fill="var(--fill-0, #131E29)" />
            <path d={svgPaths.p2129ad80} fill="var(--fill-0, #131E29)" />
            <path d={svgPaths.p202b38f0} fill="var(--fill-0, #131E29)" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_purchase">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function FinanceIcon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_finance)" id="Icon">
          <path d={svgPaths.p193c3f00} fill="var(--fill-0, #131E29)" id="Icon_2" />
        </g>
        <defs>
          <clipPath id="clip0_finance">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function SettingsIcon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_settings)" id="Icon">
          <g id="Icon_2">
            <path clipRule="evenodd" d={svgPaths.p24d52180} fill="var(--fill-0, #131E29)" fillRule="evenodd" />
            <path clipRule="evenodd" d={svgPaths.p96faa70} fill="var(--fill-0, #131E29)" fillRule="evenodd" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_settings">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function DocumentIcon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <g id="Icon_2">
            <path d={svgPaths.p398c9500} fill="var(--fill-0, #131E29)" />
            <path d={svgPaths.p12a35700} fill="var(--fill-0, #131E29)" />
            <path d={svgPaths.p307dd540} fill="var(--fill-0, #131E29)" />
            <path d={svgPaths.p3d710f80} fill="var(--fill-0, #131E29)" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function ChevronDownIcon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Navigation Indicator">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Navigation Indicator">
          <path d={svgPaths.p1663edb0} fill="var(--fill-0, #131E29)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function ChevronRightIcon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Navigation Indicator">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Navigation Indicator">
          <path d={svgPaths.p628ea00} fill="var(--fill-0, #131E29)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function PlusIcon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_plus)" id="Icon">
          <g id="Icon_2">
            <path clipRule="evenodd" d={svgPaths.p1afbe700} fill="var(--fill-0, #0064D9)" fillRule="evenodd" />
            <path d={svgPaths.p34e57700} fill="var(--fill-0, #0064D9)" />
            <path d={svgPaths.p75eac00} fill="var(--fill-0, #0064D9)" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_plus">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function UserIcon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p2d94670} fill="var(--fill-0, #131E29)" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function RewardsIcon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_rewards)" id="Icon">
          <path d={svgPaths.p159ae300} fill="var(--fill-0, #131E29)" id="Icon_2" />
        </g>
        <defs>
          <clipPath id="clip0_rewards">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

// Single Navigation Item (No Children)
interface NavigationItemProps {
  label: string;
  path: string;
  icon: React.ReactNode;
  isActive?: boolean;
}

function NavigationItem({ label, path, icon, isActive }: NavigationItemProps) {
  return (
    <Link to={path} className="no-underline">
      <div
        className={`h-[32px] relative rounded-[8px] shrink-0 w-full transition-colors ${
          isActive ? 'bg-[#ebf8ff]' : 'bg-white hover:bg-[#f7f7f7]'
        }`}
        data-name="Navigation Item"
      >
        <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[6px] py-0 relative size-full">
            {icon}
            <div className="basis-0 flex flex-col font-['72:Semibold_Duplex',sans-serif] grow justify-center leading-[0] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#131e29] text-[14px] text-nowrap">
              <p className="leading-[normal] overflow-ellipsis overflow-hidden">{label}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Navigation Group Header
interface NavigationGroupProps {
  label: string;
  isExpanded: boolean;
  onToggle: () => void;
}

function NavigationGroup({ label, isExpanded, onToggle }: NavigationGroupProps) {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full hover:bg-[#f7f7f7] transition-colors" data-name="Navigation Item">
      <button
        onClick={onToggle}
        className="flex flex-row items-center overflow-clip rounded-[inherit] size-full border-0 bg-transparent cursor-pointer w-full"
      >
        <div className="content-stretch flex gap-[4px] items-center pb-0 pl-[16px] pr-[6px] pt-[10px] relative w-full">
          <div className="basis-0 content-stretch flex grow h-[44px] items-center min-h-px min-w-px relative shrink-0">
            <div className="basis-0 flex flex-col font-['72:Regular',sans-serif] grow justify-center leading-[0] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#556b82] text-[14px] text-nowrap">
              <p className="leading-[normal] overflow-ellipsis overflow-hidden">{label}</p>
            </div>
          </div>
          <div className="flex flex-row items-center self-stretch">
            <div className="content-stretch flex h-full items-center justify-center px-[12px] py-[8px] relative shrink-0 w-[36px]">
              <div
                className={`transition-transform ${isExpanded ? 'rotate-0' : '-rotate-90'}`}
              >
                <ChevronDownIcon />
              </div>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}

// Navigation Item with Arrow (Expandable)
interface NavigationItemExpandableProps {
  label: string;
  icon: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  hasChildren?: boolean;
}

function NavigationItemExpandable({ label, icon, isExpanded, onToggle, hasChildren }: NavigationItemExpandableProps) {
  return (
    <div className="bg-white h-[32px] relative rounded-[8px] shrink-0 w-full hover:bg-[#f7f7f7] transition-colors" data-name="Navigation Item">
      <button
        onClick={onToggle}
        className="flex flex-row items-center overflow-clip rounded-[inherit] size-full border-0 bg-transparent cursor-pointer w-full"
      >
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[6px] py-0 relative size-full">
          {icon}
          <div className="basis-0 flex flex-col font-['72:Semibold_Duplex',sans-serif] grow justify-center leading-[0] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#131e29] text-[14px] text-nowrap">
            <p className="leading-[normal] overflow-ellipsis overflow-hidden">{label}</p>
          </div>
          {hasChildren && (
            <div className="content-stretch flex h-full items-center relative shrink-0">
              <div className="content-stretch flex h-full items-center justify-center px-[12px] py-[8px] relative shrink-0 w-[36px]">
                <div
                  className={`transition-transform ${isExpanded ? 'rotate-90' : 'rotate-0'}`}
                >
                  <ChevronRightIcon />
                </div>
              </div>
            </div>
          )}
        </div>
      </button>
    </div>
  );
}

// Child Navigation Item (Indented)
interface ChildNavigationItemProps {
  label: string;
  path: string;
  isActive?: boolean;
}

function ChildNavigationItem({ label, path, isActive }: ChildNavigationItemProps) {
  return (
    <Link to={path} className="no-underline">
      <div
        className={`h-[32px] relative rounded-[8px] shrink-0 w-full transition-colors ${
          isActive ? 'bg-[#ebf8ff]' : 'bg-white hover:bg-[#f7f7f7]'
        }`}
        data-name="Navigation Item"
      >
        <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex gap-[4px] items-center pl-[40px] pr-0 py-0 relative size-full">
            <div className="basis-0 flex flex-col font-['72:Regular',sans-serif] grow justify-center leading-[0] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#131e29] text-[14px] text-nowrap">
              <p className="leading-[normal] overflow-ellipsis overflow-hidden">{label}</p>
            </div>
            {isActive && (
              <div className="absolute bg-[#0064d9] bottom-0 left-0 top-0 w-[3px]" data-name="Navigation Indicator" />
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function FioriSideNavigation({ isOpen, userRole }: FioriSideNavigationProps) {
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<string[]>([
    UX_COPY.nav.sales,
    UX_COPY.nav.purchases,
    UX_COPY.nav.finance,
  ]);

  const role = normalizeRoleName(userRole);

  const showInbox = !role || role === 'financeiro' || role === 'admin' || role === 'auditoria';
  const showApprovals = !role || role === 'financeiro' || role === 'admin' || role === 'auditoria';
  const showDeals = role === 'admin';
  const financeiroChildren = [
    ...(showInbox ? [{ label: UX_COPY.nav.pending, path: '/financeiro/inbox' }] : []),
    ...(showApprovals ? [{ label: UX_COPY.nav.approvals, path: '/financeiro/aprovacoes' }] : []),
    { label: UX_COPY.nav.riskExposure, path: '/financeiro/exposicoes' },
    { label: UX_COPY.nav.rfqs, path: '/financeiro/rfqs' },
    { label: UX_COPY.nav.contracts, path: '/financeiro/contratos' },
    { label: UX_COPY.nav.pnl, path: '/financeiro/pnl' },
    { label: UX_COPY.nav.cashflow, path: '/financeiro/cashflow' },
    { label: UX_COPY.nav.reports, path: '/financeiro/exports' },
    { label: UX_COPY.nav.counterparties, path: '/financeiro/contrapartes' },
    ...(showDeals ? [{ label: UX_COPY.nav.deals, path: '/financeiro/deals' }] : []),
  ];
  const filterByRole = (items: NavItem[]): NavItem[] => {
    if (!role) return items;
    return items.filter((item) => {
      if (item.path === '/') return true;
      if (item.path === '/configuracoes') return role === 'admin';
      if (item.path === '/vendas') return role === 'vendas';
      if (item.path === '/compras') return role === 'compras';
      if (item.path === '/financeiro') return role === 'financeiro' || role === 'auditoria' || role === 'admin';
      return true;
    });
  };

  const navItems: NavItem[] = [
    { label: UX_COPY.nav.dashboard, path: '/', icon: <HomeIcon /> },
    {
      label: UX_COPY.nav.sales,
      path: '/vendas',
      icon: <SalesOrderIcon />,
      children: [
        { label: UX_COPY.nav.salesOrders, path: '/vendas/sales-orders' },
        { label: UX_COPY.nav.customers, path: '/vendas/clientes' },
      ],
    },
    {
      label: UX_COPY.nav.purchases,
      path: '/compras',
      icon: <CustomerOrderIcon />,
      children: [
        { label: UX_COPY.nav.purchaseOrders, path: '/compras/purchase-orders' },
        { label: UX_COPY.nav.suppliers, path: '/compras/fornecedores' },
      ],
    },
    {
      label: UX_COPY.nav.finance,
      path: '/financeiro',
      icon: <PaidLeaveIcon />,
      children: financeiroChildren,
    },
    {
      label: UX_COPY.nav.settings,
      path: '/configuracoes',
      icon: <SettingsIcon />,
    },
  ];

  const visibleNavItems = filterByRole(navItems);

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  const isActive = (path: string) => location.pathname === path;

  if (!isOpen) return null;

  return (
    <div
      className="bg-white content-stretch flex flex-col items-start justify-between relative shadow-[0px_0px_2px_0px_rgba(34,53,72,0.2),0px_2px_4px_0px_rgba(34,53,72,0.2)] size-full"
      data-name="Side Navigation"
    >
      {/* Content Container */}
      <div className="basis-0 bg-white grow min-h-px min-w-px relative shrink-0 w-full" data-name="Content Container">
        <div className="overflow-x-clip overflow-y-auto size-full">
          <div className="content-stretch flex flex-col gap-[4px] items-start pb-0 pt-[8px] px-[8px] relative size-full">
            {visibleNavItems.map((item) => {
              if (item.children) {
                const isExpanded = expandedGroups.includes(item.label);
                return (
                  <div key={item.label} className="w-full">
                    <NavigationItemExpandable
                      label={item.label}
                      icon={item.icon}
                      isExpanded={isExpanded}
                      onToggle={() => toggleGroup(item.label)}
                      hasChildren={true}
                    />
                    {isExpanded && (
                      <div className="flex flex-col gap-[4px] mt-[4px] w-full">
                        {item.children.map((child) => (
                          <ChildNavigationItem
                            key={child.path}
                            label={child.label}
                            path={child.path}
                            isActive={isActive(child.path)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <NavigationItem
                  key={item.path}
                  label={item.label}
                  path={item.path}
                  icon={item.icon}
                  isActive={isActive(item.path)}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white relative shrink-0 w-full" data-name="Footer">
        <div className="overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex flex-col gap-[4px] items-start pb-[8px] pt-[4px] px-[8px] relative w-full">
            <div className="h-0 relative shrink-0 w-full" data-name="Separator">
              <div className="absolute inset-[-1px_0_0_0] sap-stroke-separator">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 240 1">
                  <line id="Separator" stroke="var(--stroke-0, #D9D9D9)" x2="240" y1="0.5" y2="0.5" />
                </svg>
              </div>
            </div>

            <NavigationItem label="Perfil" path="/perfil" icon={<UserIcon />} />
          </div>
        </div>
      </div>
    </div>
  );
}