import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface FioriQuickLinkProps {
  icon: ReactNode;
  label: string;
  href: string;
}

export function FioriQuickLink({ icon, label, href }: FioriQuickLinkProps) {
  return (
    <Link
      to={href}
      className="flex items-center gap-3 px-3 py-2 rounded-[4px] hover:bg-[var(--sapList_HoverBackground,#f7f7f7)] transition-colors no-underline group"
    >
      <div className="text-[var(--sapContent_IconColor,#556b82)] group-hover:text-[var(--sapButton_TextColor,#0064d9)] transition-colors">
        {icon}
      </div>
      <span className="font-['72:Regular',sans-serif] text-[14px] text-[var(--sapContent_ForegroundTextColor,#131e29)] leading-[normal]">
        {label}
      </span>
    </Link>
  );
}
