/**
 * AwardedContractInfo Component
 * 
 * Exibe informações do(s) contrato(s) criados após premiação de RFQ.
 * 
 * Regras de negócio (AI_CONTEXT):
 * - Backend cria Contract(s) automaticamente ao premiar RFQ
 * - Contract é onde MTM, exposures e settlement são calculados
 * - RFQ é apenas fase de request
 */

import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  FlexBox,
  FlexBoxDirection,
  Link,
  ObjectStatus,
  Text,
  Title,
} from '@ui5/webcomponents-react';
import { formatNumberAuto, formatNumberMinFractionDigits } from '../../ux/format';
import ValueState from '@ui5/webcomponents-base/dist/types/ValueState.js';
import { Contract } from '../../../types';

// ============================================
// Types
// ============================================
interface AwardedContractInfoProps {
  contracts: Contract[];
  rfqId: number;
  className?: string;
}

// ============================================
// Helper: Extract trade info from snapshot
// ============================================
function extractTradeInfo(contract: Contract): {
  quantity: number;
  price: number | null;
  period: string | null;
  counterparty: string | null;
} {
  const snapshot = contract.trade_snapshot || {};
  return {
    quantity: (snapshot.quantity_mt as number) || 0,
    price: (snapshot.quote_price as number) || null,
    period: (snapshot.period as string) || null,
    counterparty: (snapshot.counterparty_name as string) || null,
  };
}

// ============================================
// AwardedContractInfo Component
// ============================================
export function AwardedContractInfo({
  contracts,
  rfqId,
  className = '',
}: AwardedContractInfoProps) {
  const navigate = useNavigate();

  // Filter contracts for this RFQ
  const rfqContracts = useMemo(() => {
    return contracts.filter(c => c.rfq_id === rfqId);
  }, [contracts, rfqId]);

  if (rfqContracts.length === 0) {
    return null;
  }

  const statusState = (status: string): ValueState => {
    if (status === 'active') return ValueState.Success;
    if (status === 'settled') return ValueState.Information;
    return ValueState.None;
  };

  return (
    <Card className={className}>
      <div style={{ padding: '0.75rem' }}>
        <Title level="H5">Contrato(s) Criados</Title>
        <Text>{rfqContracts.length} contrato(s) foram criados automaticamente a partir desta RFQ.</Text>

        <div className="mt-3 space-y-2">
          {rfqContracts.map((contract) => {
            const tradeInfo = extractTradeInfo(contract);

            return (
              <Card key={contract.contract_id} className="mb-2">
                <div style={{ padding: '0.75rem' }}>
                  <FlexBox direction={FlexBoxDirection.Row} justifyContent="SpaceBetween" alignItems="Center">
                    <Link
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/financeiro/contratos?id=${contract.contract_id}`);
                      }}
                      href="#"
                    >
                      {contract.contract_id}
                    </Link>
                    <ObjectStatus state={statusState(contract.status)}>{contract.status}</ObjectStatus>
                  </FlexBox>

                  <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
                    {tradeInfo.counterparty ? <Text>{tradeInfo.counterparty}</Text> : null}
                    {tradeInfo.quantity > 0 ? <Text>{formatNumberAuto(tradeInfo.quantity, 'pt-BR')} MT</Text> : null}
                    {tradeInfo.price != null ? <Text>{formatNumberMinFractionDigits(tradeInfo.price, 2, 'pt-BR')}</Text> : null}
                    {tradeInfo.period ? <Text>{tradeInfo.period}</Text> : null}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="mt-3">
          <Link
            onClick={(e) => {
              e.preventDefault();
              navigate(`/financeiro/contratos?rfq_id=${rfqId}`);
            }}
            href="#"
          >
            Ver todos os contratos desta RFQ
          </Link>
        </div>
      </div>
    </Card>
  );
}

export default AwardedContractInfo;
