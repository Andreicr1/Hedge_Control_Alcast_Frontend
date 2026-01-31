/**
 * RFQWizard Component
 * 
 * Wizard de 4 passos para criação e envio de RFQ:
 * 1. Seleção de SO (Sales Order)
 * 2. Configuração de Trade (legs, price_type, datas)
 * 3. Seleção de Contrapartes
 * 4. Preview e Envio
 */

import React, { useState, useCallback } from 'react';
import {
  Button,
  Card,
  CheckBox,
  CustomListItem,
  FlexBox,
  FlexBoxDirection,
  List,
  MessageStrip,
  ObjectStatus,
  Option,
  Select,
  Text,
  Title,
  Toolbar,
  ToolbarSpacer,
} from '@ui5/webcomponents-react';
import ValueState from '@ui5/webcomponents-base/dist/types/ValueState.js';
import { RFQLegConfigurator } from './RFQLegConfigurator';
import { RFQPreviewCard } from './RFQPreviewCard';
import { RFQSendProgress } from './RFQSendProgress';
import { useRfqPreview, useCreateRfq, useSendRfq } from '../../../hooks/useRfqs';
import { RfqSide, RfqPriceType, RfqTradeType, SendStatus } from '../../../types/enums';
import type { RfqLegInput, RfqPreviewRequest, RfqCreate } from '../../../types/models';
import { getInstitutionalErrorMessage } from '../../../utils/errors';

interface SalesOrderOption {
  id: number;
  code: string;
  customer: string;
  quantity: number;
  deliveryDate: string;
}

interface CounterpartyOption {
  id: number;
  name: string;
  email?: string;
  channels: ('email' | 'api' | 'whatsapp')[];
}

interface RFQWizardProps {
  salesOrders?: SalesOrderOption[];
  counterparties?: CounterpartyOption[];
  onComplete?: (rfqId: number) => void;
  onCancel?: () => void;
}

// Default leg template
const createDefaultLeg = (): Partial<RfqLegInput> => ({
  side: undefined,
  price_type: undefined,
  quantity_mt: undefined,
  start_date: '',
  end_date: '',
});

const STEPS = [
  { id: 0, title: 'Sales Order' },
  { id: 1, title: 'Configuração' },
  { id: 2, title: 'Contrapartes' },
  { id: 3, title: 'Enviar' },
];

export const RFQWizard: React.FC<RFQWizardProps> = ({
  salesOrders = [],
  counterparties = [],
  onComplete,
  onCancel,
}) => {
  // Current step
  const [currentStep, setCurrentStep] = useState(0);

  // Step 1: Selected SO
  const [selectedSO, setSelectedSO] = useState<SalesOrderOption | null>(null);

  // Step 2: Trade configuration
  const [tradeType, setTradeType] = useState<RfqTradeType>(RfqTradeType.SWAP);
  const [legs, setLegs] = useState<Array<Partial<RfqLegInput>>>([createDefaultLeg()]);

  // Step 3: Selected counterparties
  const [selectedCounterparties, setSelectedCounterparties] = useState<Set<number>>(new Set());

  // Step 4: Send progress
  const [sendTargets, setSendTargets] = useState<Array<{
    counterpartyId: number;
    counterpartyName: string;
    channel: 'email' | 'api' | 'whatsapp';
    status: SendStatus;
    error?: string;
  }>>([]);

  // Hooks
  const preview = useRfqPreview();
  const createRfq = useCreateRfq();
  const sendRfq = useSendRfq();

  // Validation states
  const isStep1Valid = selectedSO !== null;
  const isStep2Valid =
    legs.length > 0 &&
    legs.every((l) => Boolean(l.side) && Boolean(l.price_type) && (l.quantity_mt ?? 0) > 0 && Boolean(l.start_date) && Boolean(l.end_date));
  const isStep3Valid = selectedCounterparties.size > 0;

  // Handlers
  const handleSelectSO = (so: SalesOrderOption) => {
    setSelectedSO(so);
    // Auto-populate leg from SO
    if (so.quantity) {
      setLegs([{
        ...createDefaultLeg(),
        quantity_mt: so.quantity,
      }]);
    }
  };

  const handleLegChange = useCallback((index: number, updates: Partial<RfqLegInput>) => {
    setLegs(prev => prev.map((leg, i) => 
      i === index ? { ...leg, ...updates } : leg
    ));
  }, []);

  const handleAddLeg = () => {
    setLegs(prev => [...prev, createDefaultLeg()]);
  };

  const handleRemoveLeg = (index: number) => {
    setLegs(prev => prev.filter((_, i) => i !== index));
  };

  const handleToggleCounterparty = (cpId: number) => {
    setSelectedCounterparties(prev => {
      const next = new Set(prev);
      if (next.has(cpId)) {
        next.delete(cpId);
      } else {
        next.add(cpId);
      }
      return next;
    });
  };

  const handleGeneratePreview = async () => {
    if (legs.length === 0) return;

    if (!isStep2Valid) return;

    const leg1 = legs[0] as RfqLegInput;
    const leg2 = legs.length > 1 ? (legs[1] as RfqLegInput) : undefined;
    
    const request: RfqPreviewRequest = {
      trade_type: tradeType,
      leg1,
      leg2,
    };
    await preview.generatePreview(request);
  };

  const handleSendRfq = async () => {
    if (!selectedSO || !preview.preview) return;

    if (!isStep2Valid) return;

    const finalizedLegs = legs as RfqLegInput[];

    // Calculate total quantity from legs
    const totalQty = finalizedLegs.reduce((sum, leg) => sum + (leg.quantity_mt || 0), 0);

    // Create RFQ first
    const rfqData: RfqCreate = {
      rfq_number: `RFQ-${Date.now()}`,
      so_id: selectedSO.id,
      quantity_mt: totalQty,
      period: finalizedLegs[0]?.start_date || '',
      message_text: preview.preview.text,
    };

    const rfq = await createRfq.mutate(rfqData);
    if (!rfq) return;

    // Initialize send targets
    const targets = counterparties
      .filter(cp => selectedCounterparties.has(cp.id))
      .flatMap(cp => 
        cp.channels.map(channel => ({
          counterpartyId: cp.id,
          counterpartyName: cp.name,
          channel,
          status: SendStatus.QUEUED,
        }))
      );
    setSendTargets(targets);

    // Send RFQ
    const result = await sendRfq.mutate(rfq.id);
    if (result) {
      // Update all targets to sent
      setSendTargets(prev => prev.map(t => ({ ...t, status: SendStatus.SENT })));
      onComplete?.(rfq.id);
    } else {
      // Mark as failed
      setSendTargets(prev => prev.map(t => ({ 
        ...t, 
        status: SendStatus.FAILED,
        error: 'Falha no envio',
      })));
    }
  };

  const goToNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
      if (currentStep === 2) {
        handleGeneratePreview();
      }
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return isStep1Valid;
      case 1: return isStep2Valid;
      case 2: return isStep3Valid;
      default: return false;
    }
  };

  return (
    <div className="space-y-6">
      <Toolbar>
        <Title level="H4">Criar Nova RFQ</Title>
        <ToolbarSpacer />
        {onCancel ? (
          <Button design="Transparent" onClick={onCancel}>
            Cancelar
          </Button>
        ) : null}
      </Toolbar>

      <Card>
        <div style={{ padding: '0.75rem' }}>
          <FlexBox direction={FlexBoxDirection.Row} wrap style={{ gap: '0.75rem' }}>
            {STEPS.map((step, index) => {
              const isActive = currentStep === index;
              const isCompleted = currentStep > index;
              const state = isActive ? ValueState.Information : isCompleted ? ValueState.Success : ValueState.None;

              return (
                <ObjectStatus key={step.id} state={state}>
                  {index + 1}. {step.title}
                </ObjectStatus>
              );
            })}
          </FlexBox>
        </div>
      </Card>

      {/* Step Content */}
      <Card>
        <div style={{ padding: '0.75rem' }}>
          {/* Step 1: Sales Order Selection */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <Title level="H5">Selecione a Sales Order</Title>
              
              {salesOrders.length === 0 ? (
                <MessageStrip design="Information">Nenhuma Sales Order disponível.</MessageStrip>
              ) : (
                <List>
                  {salesOrders.map((so) => (
                    <CustomListItem key={so.id} type="Active" onClick={() => handleSelectSO(so)}>
                      <FlexBox direction={FlexBoxDirection.Row} justifyContent="SpaceBetween" alignItems="Center" style={{ width: '100%' }}>
                        <div>
                          <div style={{ fontWeight: 600 }}>{so.code}</div>
                          <Text>{so.customer}</Text>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 600 }}>{so.quantity} MT</div>
                          <Text>Entrega: {so.deliveryDate}</Text>
                        </div>
                      </FlexBox>
                    </CustomListItem>
                  ))}
                </List>
              )}
            </div>
          )}

          {/* Step 2: Trade Configuration */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <Title level="H5">Configuração do Trade</Title>
              
              {/* Trade Type */}
              <div className="space-y-2">
                <Text>Tipo de Trade</Text>
                <Select value={tradeType} onChange={(e) => setTradeType(String((e.target as any).value || RfqTradeType.SWAP) as RfqTradeType)}>
                  <Option value={RfqTradeType.SWAP}>Swap</Option>
                  <Option value={RfqTradeType.FORWARD}>Forward</Option>
                </Select>
              </div>

              {/* Legs */}
              <div className="space-y-4">
                {legs.map((leg, index) => (
                  <RFQLegConfigurator
                    key={index}
                    leg={leg}
                    legIndex={index}
                    onChange={handleLegChange}
                    onRemove={handleRemoveLeg}
                    showRemoveButton={legs.length > 1}
                  />
                ))}

                {/* Add Leg Button */}
                {tradeType === RfqTradeType.SWAP && legs.length < 2 && (
                  <Button design="Transparent" icon="add" onClick={handleAddLeg}>
                    Adicionar Leg
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Counterparty Selection */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <Title level="H5">Selecione as Contrapartes</Title>
              
              {counterparties.length === 0 ? (
                <MessageStrip design="Information">Nenhuma contraparte cadastrada.</MessageStrip>
              ) : (
                <>
                  <Text>{selectedCounterparties.size} contraparte(s) selecionada(s)</Text>

                  <List>
                    {counterparties.map((cp) => (
                      <CustomListItem key={cp.id} type="Active" onClick={() => handleToggleCounterparty(cp.id)}>
                        <FlexBox direction={FlexBoxDirection.Row} alignItems="Center" justifyContent="SpaceBetween" style={{ width: '100%' }}>
                          <FlexBox direction={FlexBoxDirection.Row} alignItems="Center" style={{ gap: '0.75rem' }}>
                            <CheckBox
                              checked={selectedCounterparties.has(cp.id)}
                              onChange={() => handleToggleCounterparty(cp.id)}
                            />
                            <div>
                              <div style={{ fontWeight: 600 }}>{cp.name}</div>
                              <Text>Canais: {cp.channels.map((c) => c.toUpperCase()).join(', ')}</Text>
                            </div>
                          </FlexBox>
                        </FlexBox>
                      </CustomListItem>
                    ))}
                  </List>
                </>
              )}
            </div>
          )}

          {/* Step 4: Preview & Send */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <RFQPreviewCard
                preview={preview.preview}
                isLoading={preview.isLoading}
                isError={preview.isError}
                errorMessage={preview.error ? getInstitutionalErrorMessage(preview.error) : undefined}
                onRegenerate={handleGeneratePreview}
                onConfirm={handleSendRfq}
                disabled={createRfq.isLoading || sendRfq.isLoading}
              />

              {(createRfq.isLoading || sendRfq.isLoading) && (
                <RFQSendProgress
                  targets={sendTargets}
                  isLoading={createRfq.isLoading}
                />
              )}

              {createRfq.isError && (
                <MessageStrip design="Negative">{getInstitutionalErrorMessage(createRfq.error || null)}</MessageStrip>
              )}

              {sendRfq.isError && (
                <MessageStrip design="Negative">{getInstitutionalErrorMessage(sendRfq.error || null)}</MessageStrip>
              )}

              {sendRfq.isSuccess && (
                <MessageStrip design="Positive">RFQ enviada com sucesso.</MessageStrip>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          design="Transparent"
          onClick={goToPrevStep}
          disabled={currentStep === 0 || createRfq.isLoading || sendRfq.isLoading}
        >
          Voltar
        </Button>
        
        {currentStep < 3 && (
          <Button
            onClick={goToNextStep}
            disabled={!canProceed()}
            design="Emphasized"
          >
            Próximo
          </Button>
        )}
      </div>
    </div>
  );
};

export default RFQWizard;
