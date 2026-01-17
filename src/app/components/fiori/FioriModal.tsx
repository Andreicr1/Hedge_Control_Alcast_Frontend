import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface FioriModalProps {
  title: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'small' | 'medium' | 'large';
}

export function FioriModal({
  title,
  open,
  onClose,
  children,
  footer,
  size = 'medium',
}: FioriModalProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-2xl',
    large: 'max-w-4xl',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.6)]" />

      {/* Modal */}
      <div
        className={`relative bg-[var(--sapGroup_ContentBackground)] shadow-[0_0.25rem_1rem_0_rgba(0,0,0,0.15),0_0_0_0.0625rem_rgba(0,0,0,0.15)] rounded-[0.25rem] w-full ${sizeClasses[size]} mx-4 max-h-[90vh] flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--sapGroup_TitleBorderColor)]">
          <h2
            id="modal-title"
            className="font-['72:Bold',sans-serif] text-[1.125rem] text-[var(--sapGroup_TitleTextColor)]"
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-[var(--sapButton_Hover_Background)] transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-[var(--sapContent_IconColor)]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="font-['72:Regular',sans-serif] text-[0.875rem] text-[var(--sapTextColor)]">
            {children}
          </div>
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-[var(--sapGroup_TitleBorderColor)] bg-[var(--sapPageFooter_Background)]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
