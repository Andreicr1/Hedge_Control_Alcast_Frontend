import { Link } from 'react-router-dom';

interface FioriTeamCardProps {
  actor: string;
  initials: string;
  timestamp: string;
  description: string;
  object?: string;
  href?: string;
  backgroundColor?: string;
}

export function FioriTeamCard({
  actor,
  initials,
  timestamp,
  description,
  object,
  href,
  backgroundColor = '#0064d9',
}: FioriTeamCardProps) {
  const content = (
    <>
      {/* Avatar */}
      <div
        className="shrink-0 w-[40px] h-[40px] rounded-full flex items-center justify-center font-['72:Semibold_Duplex',sans-serif] text-white text-[16px]"
        style={{ backgroundColor }}
      >
        {initials}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2 mb-1">
          <span className="font-['72:Semibold_Duplex',sans-serif] text-[14px] text-[var(--sapContent_ForegroundTextColor,#131e29)] leading-[normal] truncate">
            {description}
          </span>
        </div>

        {object ? (
          <div className="font-['72:Regular',sans-serif] text-[12px] text-[var(--sapContent_ForegroundTextColor,#131e29)] leading-[normal] mb-1 truncate">
            {object}
          </div>
        ) : null}

        <div className="font-['72:Regular',sans-serif] text-[12px] text-[var(--sapContent_LabelColor,#556b82)] leading-[normal] mb-1">
          {actor}
        </div>

        <div className="font-['72:Regular',sans-serif] text-[12px] text-[var(--sapContent_LabelColor,#556b82)] leading-[normal]">
          {timestamp}
        </div>
      </div>
    </>
  );

  if (href) {
    return (
      <Link
        to={href}
        className="flex gap-3 p-3 rounded-[4px] hover:bg-[var(--sapList_HoverBackground,#f7f7f7)] transition-colors cursor-pointer"
        title="Abrir detalhes"
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="flex gap-3 p-3 rounded-[4px] hover:bg-[var(--sapList_HoverBackground,#f7f7f7)] transition-colors">
      {content}
    </div>
  );
}
