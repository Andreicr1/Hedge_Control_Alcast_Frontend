/**
 * RFQSendProgress Component
 * 
 * Exibe progresso do envio de RFQ para múltiplas contrapartes.
 * Mostra status individual por contraparte e canal de envio.
 */

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react';
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

const STATUS_CONFIG: Record<SendStatus, { 
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
  icon: React.ReactNode;
  text: string;
}> = {
  [SendStatus.QUEUED]: { 
    variant: 'outline', 
    icon: <Clock className="h-3 w-3" />, 
    text: 'Na fila' 
  },
  [SendStatus.SENT]: { 
    variant: 'default', 
    icon: <CheckCircle2 className="h-3 w-3" />, 
    text: 'Enviado' 
  },
  [SendStatus.FAILED]: { 
    variant: 'destructive', 
    icon: <XCircle className="h-3 w-3" />, 
    text: 'Falhou' 
  },
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
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {completedCount}/{totalCount} enviados
          {failedCount > 0 && ` • ${failedCount} falha(s)`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progressPercent} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {completedCount} de {totalCount} contrapartes notificadas
          </p>
        </div>

        {/* Target List */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {targets.map((target, index) => {
              const statusConfig = STATUS_CONFIG[target.status] || STATUS_CONFIG[SendStatus.QUEUED];
              const channel = channelLabel(target.channel);

              return (
                <div
                  key={`${target.counterpartyId}-${target.channel}-${index}`}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    target.status === SendStatus.FAILED ? 'bg-destructive/5 border-destructive/20' : 'bg-muted/50'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">
                      {target.counterpartyName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {channel}
                      {target.error && ` — ${UX_COPY.errors.title}`}
                    </span>
                  </div>
                  <Badge variant={statusConfig.variant} className="gap-1">
                    {statusConfig.icon}
                    {statusConfig.text}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && targets.length === 0 && (
          <div className="flex justify-center items-center py-8 text-muted-foreground">
            Nenhuma contraparte selecionada para envio.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RFQSendProgress;
