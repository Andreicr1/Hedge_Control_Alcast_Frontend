import { ReactNode, useState, useRef, useCallback, useEffect } from 'react';
import BaseFlexibleColumnArrow from '../../../imports/BaseFlexibleColumnArrow';

interface FlexibleColumnLayoutProps {
  // Master column (left)
  masterTitle: string;
  masterContent: ReactNode;
  masterWidth?: number;
  masterMinWidth?: number;
  masterMaxWidth?: number;
  
  // Detail column (middle)
  detailContent: ReactNode;
  detailMinWidth?: number;
  
  // Detail-detail column (right, optional)
  detailDetailContent?: ReactNode;
  detailDetailWidth?: number;
  detailDetailMinWidth?: number;
  detailDetailMaxWidth?: number;
  
  // Callbacks
  onCloseMaster?: () => void;
  onCloseDetail?: () => void;
}

export function FioriFlexibleColumnLayout({
  masterTitle,
  masterContent,
  masterWidth = 320,
  masterMinWidth = 256,
  masterMaxWidth = 600,
  detailContent,
  detailMinWidth = 400,
  detailDetailContent,
  detailDetailWidth = 400,
  detailDetailMinWidth = 320,
  detailDetailMaxWidth = 800,
  onCloseMaster,
  onCloseDetail,
}: FlexibleColumnLayoutProps) {
  const [currentMasterWidth, setCurrentMasterWidth] = useState(masterWidth);
  const [currentDetailDetailWidth, setCurrentDetailDetailWidth] = useState(detailDetailWidth);
  
  const isDraggingMaster = useRef(false);
  const isDraggingDetail = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Master column resize handler
  const handleMasterMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingMaster.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  // Detail-Detail column resize handler
  const handleDetailMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingDetail.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();

      if (isDraggingMaster.current) {
        const newWidth = e.clientX - containerRect.left;
        const clampedWidth = Math.max(masterMinWidth, Math.min(masterMaxWidth, newWidth));
        setCurrentMasterWidth(clampedWidth);
      }

      if (isDraggingDetail.current) {
        const newWidth = containerRect.right - e.clientX;
        const clampedWidth = Math.max(detailDetailMinWidth, Math.min(detailDetailMaxWidth, newWidth));
        setCurrentDetailDetailWidth(clampedWidth);
      }
    };

    const handleMouseUp = () => {
      if (isDraggingMaster.current || isDraggingDetail.current) {
        isDraggingMaster.current = false;
        isDraggingDetail.current = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [masterMinWidth, masterMaxWidth, detailDetailMinWidth, detailDetailMaxWidth]);

  return (
    <div ref={containerRef} className="flex h-full bg-[#f5f6f7] relative overflow-hidden">
      {/* Master Column */}
      <div
        className="flex flex-col bg-white border-r border-[#d9d9d9] overflow-hidden shrink-0"
        style={{ width: `${currentMasterWidth}px` }}
      >
        {masterContent}
      </div>

      {/* Separator Arrow - Master/Detail (Draggable) */}
      <div
        className="flex items-center justify-center relative shrink-0 cursor-col-resize hover:bg-[#e5e5e5] transition-colors"
        onMouseDown={handleMasterMouseDown}
        role="separator"
        aria-label="Resize master column"
        aria-orientation="vertical"
      >
        <div className="h-full w-4 pointer-events-none">
          <BaseFlexibleColumnArrow />
        </div>
      </div>

      {/* Detail Column */}
      <div className="flex-1 flex flex-col bg-[#f5f6f7] overflow-hidden min-w-0" style={{ minWidth: `${detailMinWidth}px` }}>
        {detailContent}
      </div>

      {/* Separator Arrow - Detail/Detail-Detail (Draggable, if Detail-Detail exists) */}
      {detailDetailContent && (
        <>
          <div
            className="flex items-center justify-center relative shrink-0 cursor-col-resize hover:bg-[#e5e5e5] transition-colors"
            onMouseDown={handleDetailMouseDown}
            role="separator"
            aria-label="Resize detail column"
            aria-orientation="vertical"
          >
            <div className="h-full w-4 pointer-events-none">
              <BaseFlexibleColumnArrow />
            </div>
          </div>

          {/* Detail-Detail Column */}
          <div
            className="flex flex-col bg-white border-l border-[#d9d9d9] overflow-hidden shrink-0"
            style={{ width: `${currentDetailDetailWidth}px` }}
          >
            {detailDetailContent}
          </div>
        </>
      )}
    </div>
  );
}