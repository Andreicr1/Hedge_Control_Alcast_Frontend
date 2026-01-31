import { useEffect, useMemo, useState } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';

import { Bar, Button, BusyIndicator, Dialog, FlexBox, FlexBoxDirection, Text } from '@ui5/webcomponents-react';

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
    <Dialog
      open={open}
      headerText={title}
      stretch
      onClose={() => onOpenChange(false)}
      footer={
        <Bar
          endContent={
            <FlexBox direction={FlexBoxDirection.Row} style={{ gap: '0.5rem' }}>
              <Button design="Transparent" onClick={() => onOpenChange(false)}>
                Fechar
              </Button>
            </FlexBox>
          }
        />
      }
    >
      <div style={{ padding: '1rem' }}>
        {!fileUrl ? (
          <Text style={{ opacity: 0.75 }}>Arquivo indisponível.</Text>
        ) : (
          <FlexBox direction={FlexBoxDirection.Column} style={{ gap: '0.75rem' }}>
            <FlexBox direction={FlexBoxDirection.Row} justifyContent="SpaceBetween" style={{ gap: '0.75rem', alignItems: 'center' }}>
              <Text style={{ opacity: 0.75, fontSize: '0.8125rem' }}>
                {numPages ? `Página ${pageNumber} de ${numPages}` : 'Carregando…'}
              </Text>
              <FlexBox direction={FlexBoxDirection.Row} style={{ gap: '0.5rem' }}>
                <Button design="Transparent" disabled={!canPrev} onClick={() => setPageNumber((p) => Math.max(1, p - 1))}>
                  Anterior
                </Button>
                <Button
                  design="Transparent"
                  disabled={!canNext}
                  onClick={() => setPageNumber((p) => (numPages ? Math.min(numPages, p + 1) : p + 1))}
                >
                  Próxima
                </Button>
              </FlexBox>
            </FlexBox>

            <div
              style={{
                ...containerStyle,
                border: '1px solid var(--sapGroup_ContentBorderColor)',
                borderRadius: 8,
                background: 'white',
                overflow: 'auto',
              }}
            >
              <div style={{ padding: '0.75rem' }}>
                <Document
                  file={fileUrl}
                  onLoadSuccess={({ numPages: n }) => setNumPages(n)}
                  loading={
                    <div>
                      <BusyIndicator active delay={0} />
                      <Text style={{ marginTop: '0.5rem', opacity: 0.75 }}>Carregando PDF…</Text>
                    </div>
                  }
                  error={<Text style={{ color: 'var(--sapNegativeColor)' }}>Não foi possível abrir o PDF.</Text>}
                >
                  <Page pageNumber={pageNumber} width={1000} renderTextLayer={false} renderAnnotationLayer={false} />
                </Document>
              </div>
            </div>
          </FlexBox>
        )}
      </div>
    </Dialog>
  );
}
