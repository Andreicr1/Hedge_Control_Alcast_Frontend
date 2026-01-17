import { RFQQuote } from '../../data/types';
import { FioriModal } from './fiori/FioriModal';
import { FioriButton } from './fiori/FioriButton';
import { FioriInput } from './fiori/FioriInput';

interface RFQRankingModalsProps {
  showAwardModal: boolean;
  showRejectModal: boolean;
  showRefreshModal: boolean;
  selectedQuote: RFQQuote | null;
  rejectionReason: string;
  onCloseAward: () => void;
  onCloseReject: () => void;
  onCloseRefresh: () => void;
  onConfirmAward: () => void;
  onConfirmReject: () => void;
  onConfirmRefresh: () => void;
  onRejectionReasonChange: (value: string) => void;
  getChannelLabel: (channel: string) => string;
}

export function RFQRankingModals({
  showAwardModal,
  showRejectModal,
  showRefreshModal,
  selectedQuote,
  rejectionReason,
  onCloseAward,
  onCloseReject,
  onCloseRefresh,
  onConfirmAward,
  onConfirmReject,
  onConfirmRefresh,
  onRejectionReasonChange,
  getChannelLabel,
}: RFQRankingModalsProps) {
  return (
    <>
      {/* Award Modal */}
      {showAwardModal && selectedQuote && (
        <FioriModal
          title="Confirmar Contratação"
          open={showAwardModal}
          onClose={onCloseAward}
          footer={
            <div className="flex gap-2 justify-end">
              <FioriButton variant="ghost" onClick={onCloseAward}>
                Cancelar
              </FioriButton>
              <FioriButton variant="positive" onClick={onConfirmAward}>
                Confirmar Contratação
              </FioriButton>
            </div>
          }
        >
          <div className="space-y-4">
            <p className="font-['72:Regular',sans-serif] text-sm text-[#131e29]">
              Você está prestes a contratar a cotação de{' '}
              <strong className="font-['72:Bold',sans-serif]">{selectedQuote.counterparty}</strong>.
            </p>
            <div className="p-4 bg-[var(--sapInfoBackground)] border border-[var(--sapField_InformationColor)] rounded">
              <p className="font-['72:Regular',sans-serif] text-sm text-[#131e29] mb-3">
                <strong className="font-['72:Bold',sans-serif]">Detalhes da cotação:</strong>
              </p>
              <ul className="space-y-2 text-sm font-['72:Regular',sans-serif] text-[#131e29]">
                <li>Preço de Compra: <strong>${selectedQuote.buy_price?.toFixed(2)}</strong></li>
                <li>Preço de Venda: <strong>${selectedQuote.sell_price?.toFixed(2)}</strong></li>
                <li>Spread: <strong>${selectedQuote.spread?.toFixed(2)}</strong></li>
                <li>Volume: <strong>{selectedQuote.volume_mt} MT</strong></li>
              </ul>
            </div>
            <p className="font-['72:Regular',sans-serif] text-sm text-[var(--sapContent_LabelColor)]">
              Ao contratar, será criado o contrato financeiro vinculado ao RFQ. Esta ação não pode ser desfeita.
            </p>
          </div>
        </FioriModal>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedQuote && (
        <FioriModal
          title="Recusar Cotação"
          open={showRejectModal}
          onClose={onCloseReject}
          footer={
            <div className="flex gap-2 justify-end">
              <FioriButton variant="ghost" onClick={onCloseReject}>
                Cancelar
              </FioriButton>
              <FioriButton variant="negative" onClick={onConfirmReject}>
                Confirmar Recusa
              </FioriButton>
            </div>
          }
        >
          <div className="space-y-4">
            <p className="font-['72:Regular',sans-serif] text-sm text-[#131e29]">
              Você está recusando a cotação de{' '}
              <strong className="font-['72:Bold',sans-serif]">{selectedQuote.counterparty}</strong>.
            </p>
            <FioriInput
              label="Motivo da recusa (opcional)"
              value={rejectionReason}
              onChange={(e) => onRejectionReasonChange(e.target.value)}
              placeholder="Ex: Spread não competitivo, preço fora da faixa..."
              fullWidth
            />
            <p className="font-['72:Regular',sans-serif] text-sm text-[var(--sapContent_LabelColor)]">
              Uma resposta padronizada será enviada à contraparte pelo canal original.
            </p>
          </div>
        </FioriModal>
      )}

      {/* Refresh Modal */}
      {showRefreshModal && selectedQuote && (
        <FioriModal
          title="Solicitar Atualização de Cotação"
          open={showRefreshModal}
          onClose={onCloseRefresh}
          footer={
            <div className="flex gap-2 justify-end">
              <FioriButton variant="ghost" onClick={onCloseRefresh}>
                Cancelar
              </FioriButton>
              <FioriButton variant="emphasized" onClick={onConfirmRefresh}>
                Enviar Solicitação
              </FioriButton>
            </div>
          }
        >
          <div className="space-y-4">
            <p className="font-['72:Regular',sans-serif] text-sm text-[#131e29]">
              Você está solicitando uma nova cotação para{' '}
              <strong className="font-['72:Bold',sans-serif]">{selectedQuote.counterparty}</strong>.
            </p>
            <div className="p-4 bg-[var(--sapInfoBackground)] border border-[var(--sapField_InformationColor)] rounded">
              <p className="font-['72:Regular',sans-serif] text-sm text-[#131e29]">
                <strong className="font-['72:Bold',sans-serif]">Canal de envio:</strong>{' '}
                {getChannelLabel(selectedQuote.channel)}
              </p>
            </div>
            <p className="font-['72:Regular',sans-serif] text-sm text-[var(--sapContent_LabelColor)]">
              Uma mensagem padronizada será enviada solicitando atualização da cotação.
            </p>
          </div>
        </FioriModal>
      )}
    </>
  );
}
