/**
 * RFQPreviewCard Component
 * 
 * Exibe preview da mensagem LME gerada pelo backend.
 * Mostra texto formatado, permite copiar e confirmar envio.
 */

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { Copy, Check, RefreshCw, Send, AlertCircle, Loader2 } from 'lucide-react';
import type { RfqPreviewResponse } from '../../../types/models';

interface RFQPreviewCardProps {
  preview: RfqPreviewResponse | null;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onCopy?: () => void;
  onConfirm?: () => void;
  onRegenerate?: () => void;
  disabled?: boolean;
}

export const RFQPreviewCard: React.FC<RFQPreviewCardProps> = ({
  preview,
  isLoading = false,
  isError = false,
  errorMessage,
  onCopy,
  onConfirm,
  onRegenerate,
  disabled = false,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (preview?.text) {
      try {
        await navigator.clipboard.writeText(preview.text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        onCopy?.();
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Preview da Mensagem RFQ</CardTitle>
        <CardDescription>
          Mensagem que será enviada às contrapartes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Error State */}
        {isError && !isLoading && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {errorMessage || 'Erro ao gerar preview da mensagem RFQ.'}
            </AlertDescription>
          </Alert>
        )}

        {/* Preview Content */}
        {!isLoading && !isError && preview && (
          <>
            {/* Metadata */}
            <div className="flex flex-wrap gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Tipo de Trade
                </p>
                <Badge variant="outline">
                  {preview.trade_type || '--'}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Legs
                </p>
                <Badge variant="outline">
                  {preview.leg_count || 0}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Quantidade Total
                </p>
                <Badge variant="outline">
                  {preview.total_quantity_mt?.toLocaleString() || '--'} MT
                </Badge>
              </div>
            </div>

            {/* Message Preview */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Mensagem LME</p>
              <pre className="bg-muted p-4 rounded-lg border font-mono text-sm whitespace-pre-wrap break-words max-h-80 overflow-y-auto">
                {preview.text}
              </pre>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              {onRegenerate && (
                <Button
                  variant="ghost"
                  onClick={onRegenerate}
                  disabled={disabled || isLoading}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerar
                </Button>
              )}
              <Button
                variant="outline"
                onClick={handleCopy}
                disabled={disabled || isLoading || !preview.text}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar
                  </>
                )}
              </Button>
              {onConfirm && (
                <Button
                  onClick={onConfirm}
                  disabled={disabled || isLoading}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Confirmar e Enviar
                </Button>
              )}
            </div>
          </>
        )}

        {/* Empty State */}
        {!isLoading && !isError && !preview && (
          <div className="flex justify-center items-center py-12 text-muted-foreground">
            Configure os legs e clique em "Gerar Preview" para ver a mensagem.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RFQPreviewCard;
