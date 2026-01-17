interface FioriTeamCardProps {
  name: string;
  role: string;
  initials: string;
  timestamp: string;
  message: string;
  quote?: string;
  backgroundColor?: string;
}

export function FioriTeamCard({
  name,
  role,
  initials,
  timestamp,
  message,
  quote,
  backgroundColor = '#0064d9',
}: FioriTeamCardProps) {
  return (
    <div className="flex gap-3 p-3 rounded-[4px] hover:bg-[var(--sapList_HoverBackground,#f7f7f7)] transition-colors">
      {/* Avatar */}
      <div
        className="shrink-0 w-[40px] h-[40px] rounded-full flex items-center justify-center font-['72:Semibold_Duplex',sans-serif] text-white text-[16px]"
        style={{ backgroundColor }}
      >
        {initials}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-['72:Semibold_Duplex',sans-serif] text-[14px] text-[var(--sapContent_ForegroundTextColor,#131e29)] leading-[normal]">
            {name}
          </span>
          <span className="font-['72:Regular',sans-serif] text-[14px] text-[var(--sapContent_LabelColor,#556b82)] leading-[normal]">
            {role}
          </span>
        </div>
        <div className="font-['72:Regular',sans-serif] text-[12px] text-[var(--sapContent_LabelColor,#556b82)] leading-[normal] mb-2">
          {timestamp}
        </div>
        <div className="font-['72:Regular',sans-serif] text-[14px] text-[var(--sapContent_ForegroundTextColor,#131e29)] leading-[1.4] mb-2">
          {message}
        </div>
        {quote && (
          <div className="font-['72:Regular',sans-serif] text-[14px] text-[var(--sapContent_LabelColor,#556b82)] leading-[1.4] italic border-l-2 border-[var(--sapContent_ForegroundBorderColor,#d9d9d9)] pl-3">
            "{quote}"
          </div>
        )}
      </div>
    </div>
  );
}
