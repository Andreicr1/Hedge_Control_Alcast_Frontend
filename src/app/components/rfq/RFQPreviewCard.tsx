/**
 * RFQPreviewCard Component
 * 
 * Exibe preview da mensagem LME gerada pelo backend.
 * Mostra texto formatado, permite copiar e confirmar envio.
 */

import React, { useState } from 'react';
import {
  BusyIndicator,
  Button,
  Card,
  FlexBox,
  FlexBoxDirection,
  MessageStrip,
  ObjectStatus,
  Text,
  TextArea,
  Title,
} from '@ui5/webcomponents-react';
import ValueState from '@ui5/webcomponents-base/dist/types/ValueState.js';
import type { RfqPreviewResponse } from '../../../types/models';
import { formatNumberAuto } from '../../ux/format';

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
      <div style={{ padding: '0.75rem' }}>
        <Title level="H5">Preview da Mensagem RFQ</Title>
        <Text>Mensagem que será enviada às contrapartes</Text>

        {isLoading ? (
          <div className="mt-4 flex items-center justify-center">
            <BusyIndicator active delay={0} />
          </div>
        ) : null}

        {isError && !isLoading ? (
          <div className="mt-4">
            <MessageStrip design="Negative">{errorMessage || 'Erro ao gerar preview da mensagem RFQ.'}</MessageStrip>
          </div>
        ) : null}

        {!isLoading && !isError && preview ? (
          <>
            <FlexBox className="mt-4" direction={FlexBoxDirection.Row} wrap>
              <div className="mr-6 mb-2">
                <Text>Tipo de Trade</Text>
                <ObjectStatus state={ValueState.None}>{preview.trade_type || '—'}</ObjectStatus>
              </div>
              <div className="mr-6 mb-2">
                <Text>Legs</Text>
                <ObjectStatus state={ValueState.None}>{String(preview.leg_count || 0)}</ObjectStatus>
              </div>
              <div className="mr-6 mb-2">
                <Text>Quantidade Total</Text>
                <ObjectStatus state={ValueState.None}>
                        {preview.total_quantity_mt != null ? `${formatNumberAuto(preview.total_quantity_mt, 'pt-BR')} MT` : '—'}
                </ObjectStatus>
              </div>
            </FlexBox>

            <div className="mt-4">
              <Text>Mensagem LME</Text>
              <TextArea
                className="mt-2 font-['Courier_New',monospace] text-[11px]"
                rows={12}
                readonly
                value={preview.text}
              />
            </div>

            <div className="mt-4 flex justify-end gap-2">
              {onRegenerate ? (
                <Button design="Transparent" icon="refresh" onClick={onRegenerate} disabled={disabled || isLoading}>
                  Regenerar
                </Button>
              ) : null}

              <Button
                design="Transparent"
                icon={copied ? 'accept' : 'copy'}
                onClick={handleCopy}
                disabled={disabled || isLoading || !preview.text}
              >
                {copied ? 'Copiado' : 'Copiar'}
              </Button>

              {onConfirm ? (
                <Button design="Emphasized" icon="paper-plane" onClick={onConfirm} disabled={disabled || isLoading}>
                  Confirmar e Enviar
                </Button>
              ) : null}
            </div>
          </>
        ) : null}

        {!isLoading && !isError && !preview ? (
          <div className="mt-4">
            <Text>Preview indisponível.</Text>
          </div>
        ) : null}
      </div>
    </Card>
  );
};

export default RFQPreviewCard;
