import { useEffect, useMemo, useState } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

// Vite-friendly worker resolution
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export interface PdfViewerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  fileUrl: string | null;
}

export function PdfViewerDialog({ open, onOpenChange, title, fileUrl }: PdfViewerDialogProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    if (!open) {
      setNumPages(null);
      setPageNumber(1);
    }
  }, [open]);

  const canPrev = pageNumber > 1;
  const canNext = numPages ? pageNumber < numPages : false;

  const containerStyle = useMemo(
    () => ({ width: '100%', height: 'calc(80vh - 72px)' }),
    [],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {!fileUrl ? (
          <div className="text-sm text-[var(--sapContent_LabelColor)]">Arquivo indisponível.</div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs text-[var(--sapContent_LabelColor)]">
                {numPages ? `Página ${pageNumber} de ${numPages}` : 'Carregando…'}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={!canPrev}
                  onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                  className="h-8 px-3 text-sm rounded border border-[var(--sapButton_BorderColor)] disabled:opacity-50"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  disabled={!canNext}
                  onClick={() => setPageNumber((p) => (numPages ? Math.min(numPages, p + 1) : p + 1))}
                  className="h-8 px-3 text-sm rounded border border-[var(--sapButton_BorderColor)] disabled:opacity-50"
                >
                  Próxima
                </button>
              </div>
            </div>

            <div
              className="rounded border border-[var(--sapGroup_ContentBorderColor)] bg-white overflow-auto"
              style={containerStyle}
            >
              <div className="p-3">
                <Document
                  file={fileUrl}
                  onLoadSuccess={({ numPages: n }) => setNumPages(n)}
                  loading={<div className="text-sm text-[var(--sapContent_LabelColor)]">Carregando PDF…</div>}
                  error={<div className="text-sm text-[var(--sapNegativeColor)]">Não foi possível abrir o PDF.</div>}
                >
                  <Page pageNumber={pageNumber} width={1000} renderTextLayer={false} renderAnnotationLayer={false} />
                </Document>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
