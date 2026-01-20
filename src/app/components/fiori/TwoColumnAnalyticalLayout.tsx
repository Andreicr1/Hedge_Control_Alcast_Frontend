import { ReactNode } from 'react';

interface TwoColumnAnalyticalLayoutProps {
  leftColumn: ReactNode;
  rightColumn: ReactNode;
  leftTitle?: string;
  rightTitle?: string;
  leftActions?: ReactNode;
  rightActions?: ReactNode;
  leftWidth?: number;
  leftMinWidth?: number;
  leftMaxWidth?: number;
  className?: string;
}

export function TwoColumnAnalyticalLayout({
  leftColumn,
  rightColumn,
  leftTitle,
  rightTitle,
  leftActions,
  rightActions,
  leftWidth = 320,
  leftMinWidth = 280,
  leftMaxWidth = 500,
  className = '',
}: TwoColumnAnalyticalLayoutProps) {
  return (
    <div className={`flex h-full bg-[var(--sapBackgroundColor)] ${className}`}>
      {/* Left Column: Navigation/Selection */}
      <div
        className="flex flex-col bg-white border-r border-[var(--sapList_BorderColor)] shrink-0 overflow-hidden"
        style={{ 
          width: `${leftWidth}px`,
          minWidth: `${leftMinWidth}px`,
          maxWidth: `${leftMaxWidth}px`
        }}
      >
        {(leftTitle || leftActions) && (
          <div className="px-4 py-3 border-b border-[var(--sapList_BorderColor)] bg-[var(--sapList_HeaderBackground)]">
            <div className="flex items-center justify-between">
              {leftTitle && (
                <h2 className="text-sm font-['72:Bold',sans-serif] text-[var(--sapList_HeaderTextColor)] m-0">
                  {leftTitle}
                </h2>
              )}
              {leftActions && <div className="ml-2">{leftActions}</div>}
            </div>
          </div>
        )}
        <div className="flex-1 overflow-y-auto">
          {leftColumn}
        </div>
      </div>

      {/* Right Column: Analysis/Detail */}
      <div className="flex-1 flex flex-col min-w-0">
        {(rightTitle || rightActions) && (
          <div className="px-4 py-3 border-b border-[var(--sapList_BorderColor)] bg-[var(--sapPageHeader_Background)]">
            <div className="flex items-center justify-between">
              {rightTitle && (
                <h2 className="text-sm font-['72:Bold',sans-serif] text-[var(--sapPageHeader_TextColor)] m-0">
                  {rightTitle}
                </h2>
              )}
              {rightActions && <div className="ml-2">{rightActions}</div>}
            </div>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-4">
          {rightColumn}
        </div>
      </div>
    </div>
  );
}
