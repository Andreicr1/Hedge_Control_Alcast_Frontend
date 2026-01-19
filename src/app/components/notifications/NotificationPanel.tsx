import { useCallback } from 'react';
import { X } from 'lucide-react';
import type { NotificationItem } from '../../../services/notification.service';

interface NotificationPanelProps {
  open: boolean;
  items: NotificationItem[];
  onClose: () => void;
  onItemClick: (item: NotificationItem) => void;
}

export function NotificationPanel({ open, items, onClose, onItemClick }: NotificationPanelProps) {
  const handleClose = useCallback(() => onClose(), [onClose]);

  if (!open) return null;

  return (
    <aside
      className="fixed right-0 top-[52px] z-[1300] h-[calc(100vh-52px)] w-[380px] bg-white border-l border-[#d9d9d9] shadow-[0_8px_24px_rgba(0,0,0,0.16)]"
      aria-label="Notificações"
    >
      <div className="h-[52px] px-4 flex items-center justify-between border-b border-[#e5e5e5]">
        <h2 className="font-['72:Bold',sans-serif] text-[14px] text-[#131e29] m-0">Notificações</h2>
        <button
          type="button"
          onClick={handleClose}
          className="p-2 rounded-[8px] hover:bg-[#eff1f2] transition-colors border-0 bg-transparent"
          aria-label="Fechar"
          title="Fechar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="h-[calc(100%-52px)] overflow-auto">
        {items.length === 0 ? (
          <div className="p-4 text-[13px] text-[#556b82] font-['72:Regular',sans-serif]">Sem notificações.</div>
        ) : (
          <div className="flex flex-col">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onItemClick(item)}
                className="w-full text-left px-4 py-3 border-b border-[#efefef] hover:bg-[#f7f7f7] transition-colors bg-transparent"
                title="Abrir"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div
                      className={`font-['72:Semibold_Duplex',sans-serif] text-[14px] text-[#131e29] leading-[normal] truncate ${
                        item.read ? 'opacity-80' : ''
                      }`}
                    >
                      {item.title}
                    </div>
                    {item.object ? (
                      <div className="font-['72:Regular',sans-serif] text-[12px] text-[#556b82] mt-1 truncate">
                        {item.object}
                      </div>
                    ) : null}
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {!item.read ? <span className="inline-block w-[6px] h-[6px] rounded-full bg-[#0064d9]" /> : null}
                    <div className="font-['72:Regular',sans-serif] text-[12px] text-[#556b82] whitespace-nowrap">
                      {item.timestamp}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
