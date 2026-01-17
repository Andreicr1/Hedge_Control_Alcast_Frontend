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
import { Link } from 'react-router-dom';
import { FileCheck, ExternalLink, TrendingUp, Calendar, Building2 } from 'lucide-react';
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
  // Filter contracts for this RFQ
  const rfqContracts = useMemo(() => {
    return contracts.filter(c => c.rfq_id === rfqId);
  }, [contracts, rfqId]);

  if (rfqContracts.length === 0) {
    return null;
  }

  return (
    <div className={`bg-[var(--sapInformationBackground,#e5f0fa)] border border-[var(--sapInformationBorderColor,#0854a0)] rounded-lg p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <FileCheck className="w-5 h-5 text-[var(--sapInformativeColor,#0854a0)]" />
        <h3 className="font-['72:Bold',sans-serif] text-base text-[var(--sapInformativeTextColor,#0854a0)]">
          Contrato(s) Criados
        </h3>
      </div>

      <p className="text-sm text-[var(--sapContent_LabelColor,#6a6d70)] mb-3">
        {rfqContracts.length} contrato(s) foram criados automaticamente a partir desta RFQ:
      </p>

      <div className="space-y-2">
        {rfqContracts.map((contract) => {
          const tradeInfo = extractTradeInfo(contract);
          
          return (
            <div 
              key={contract.contract_id}
              className="bg-white rounded p-3 border border-[var(--sapTile_BorderColor,#e5e5e5)]"
            >
              <div className="flex items-center justify-between mb-2">
                <Link 
                  to={`/financeiro/contratos?id=${contract.contract_id}`}
                  className="font-['72:Bold',sans-serif] text-sm text-[#0064d9] hover:underline flex items-center gap-1"
                >
                  {contract.contract_id}
                  <ExternalLink className="w-3 h-3" />
                </Link>
                <span className={`
                  px-2 py-0.5 rounded text-[10px] font-semibold uppercase
                  ${contract.status === 'active' ? 'bg-green-100 text-green-700' : 
                    contract.status === 'settled' ? 'bg-gray-100 text-gray-700' : 
                    'bg-blue-100 text-blue-700'}
                `}>
                  {contract.status}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                {tradeInfo.counterparty && (
                  <div className="flex items-center gap-1 text-[var(--sapContent_LabelColor,#6a6d70)]">
                    <Building2 className="w-3 h-3" />
                    {tradeInfo.counterparty}
                  </div>
                )}
                {tradeInfo.quantity > 0 && (
                  <div className="flex items-center gap-1 text-[var(--sapContent_LabelColor,#6a6d70)]">
                    <TrendingUp className="w-3 h-3" />
                    {tradeInfo.quantity.toLocaleString('pt-BR')} MT
                  </div>
                )}
                {tradeInfo.price && (
                  <div className="flex items-center gap-1 text-[var(--sapContent_LabelColor,#6a6d70)]">
                    <span className="font-semibold">$</span>
                    {tradeInfo.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                )}
                {tradeInfo.period && (
                  <div className="flex items-center gap-1 text-[var(--sapContent_LabelColor,#6a6d70)]">
                    <Calendar className="w-3 h-3" />
                    {tradeInfo.period}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 text-center">
        <Link 
          to={`/financeiro/contratos?rfq_id=${rfqId}`}
          className="text-sm text-[#0064d9] hover:underline inline-flex items-center gap-1"
        >
          Ver todos os contratos desta RFQ
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}

export default AwardedContractInfo;
