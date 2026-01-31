/**
 * RFQSendProgress Component
 * 
 * Exibe progresso do envio de RFQ para múltiplas contrapartes.
 * Mostra status individual por contraparte e canal de envio.
 */

import React from 'react';
import {
  BusyIndicator,
  Card,
  List,
  ObjectStatus,
  ProgressIndicator,
  StandardListItem,
  Text,
  Title,
} from '@ui5/webcomponents-react';
import ValueState from '@ui5/webcomponents-base/dist/types/ValueState.js';
import { SendStatus } from '../../../types/enums';
import { UX_COPY } from '../../ux/copy';

interface SendTarget {
  counterpartyId: number;
  counterpartyName: string;
  channel: 'email' | 'api' | 'whatsapp';
  status: SendStatus;
  error?: string;
  attemptId?: number;
}

interface RFQSendProgressProps {
  targets: SendTarget[];
  isLoading?: boolean;
  title?: string;
  onRetry?: (target: SendTarget) => void;
}

const STATUS_LABEL: Record<SendStatus, { text: string; state: ValueState }> = {
  [SendStatus.QUEUED]: { text: 'Na fila', state: ValueState.Information },
  [SendStatus.SENT]: { text: 'Enviado', state: ValueState.Success },
  [SendStatus.FAILED]: { text: 'Falhou', state: ValueState.Error },
};

function channelLabel(channel: SendTarget['channel']): string {
  if (channel === 'email') return 'E-mail';
  if (channel === 'api') return 'Integração';
  if (channel === 'whatsapp') return 'WhatsApp';
  return String(channel);
}

export const RFQSendProgress: React.FC<RFQSendProgressProps> = ({
  targets,
  isLoading = false,
  title = 'Progresso de Envio',
}) => {
  // Calculate progress
  const totalCount = targets.length;
  const completedCount = targets.filter(t => t.status === SendStatus.SENT).length;
  const failedCount = targets.filter(t => t.status === SendStatus.FAILED).length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <Card className="mb-4">
      <div style={{ padding: '0.75rem' }}>
        <Title level="H5">{title}</Title>
        <Text>
          {completedCount}/{totalCount} enviados{failedCount > 0 ? ` • ${failedCount} falha(s)` : ''}
        </Text>

        <div className="mt-3">
          <ProgressIndicator value={progressPercent} valueState={failedCount > 0 ? ValueState.Error : ValueState.Success} />
          <div className="mt-1">
            <Text>
              {completedCount} de {totalCount} contrapartes notificadas
            </Text>
          </div>
        </div>

        {isLoading ? (
          <div className="mt-4 flex items-center justify-center">
            <BusyIndicator active delay={0} />
          </div>
        ) : targets.length === 0 ? (
          <div className="mt-4">
            <Text>Nenhuma contraparte selecionada para envio.</Text>
          </div>
        ) : (
          <div className="mt-4 max-h-72 overflow-y-auto">
            <List>
              {targets.map((target, index) => {
                const status = STATUS_LABEL[target.status] || STATUS_LABEL[SendStatus.QUEUED];
                const channel = channelLabel(target.channel);

                return (
                  <StandardListItem
                    key={`${target.counterpartyId}-${target.channel}-${index}`}
                    description={target.error ? `${channel} — ${UX_COPY.errors.title}` : channel}
                    additionalText={status.text}
                    additionalTextState={status.state}
                  >
                    {target.counterpartyName}
                  </StandardListItem>
                );
              })}
            </List>
          </div>
        )}

        {failedCount > 0 ? (
          <div className="mt-3">
            <ObjectStatus state={ValueState.Error}>{UX_COPY.errors.title}</ObjectStatus>
          </div>
        ) : null}
      </div>
    </Card>
  );
};

export default RFQSendProgress;
