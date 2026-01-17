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
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { 
  ChevronRight, 
  ChevronLeft, 
  FileText, 
  Settings, 
  Users, 
  Send,
  Plus,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
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
const createDefaultLeg = (): RfqLegInput => ({
  side: RfqSide.BUY,
  price_type: RfqPriceType.AVG,
  quantity_mt: 0,
  start_date: '',
  end_date: '',
});

// Step indicators
const STEPS = [
  { id: 0, title: 'Sales Order', icon: FileText },
  { id: 1, title: 'Configuração', icon: Settings },
  { id: 2, title: 'Contrapartes', icon: Users },
  { id: 3, title: 'Enviar', icon: Send },
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
  const [legs, setLegs] = useState<RfqLegInput[]>([createDefaultLeg()]);

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
  const isStep2Valid = legs.length > 0 && legs.every(
    l => l.side && l.price_type && l.quantity_mt > 0 && l.start_date && l.end_date
  );
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
    
    const request: RfqPreviewRequest = {
      trade_type: tradeType,
      leg1: legs[0],
      leg2: legs.length > 1 ? legs[1] : undefined,
    };
    await preview.generatePreview(request);
  };

  const handleSendRfq = async () => {
    if (!selectedSO || !preview.preview) return;

    // Calculate total quantity from legs
    const totalQty = legs.reduce((sum, leg) => sum + (leg.quantity_mt || 0), 0);

    // Create RFQ first
    const rfqData: RfqCreate = {
      rfq_number: `RFQ-${Date.now()}`,
      so_id: selectedSO.id,
      quantity_mt: totalQty,
      period: legs[0]?.start_date || new Date().toISOString().slice(0, 7),
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Criar Nova RFQ</h2>
        {onCancel && (
          <Button variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-between px-4">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === index;
          const isCompleted = currentStep > index;
          
          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    isActive 
                      ? 'bg-primary text-primary-foreground border-primary' 
                      : isCompleted 
                        ? 'bg-primary/20 text-primary border-primary/50'
                        : 'bg-muted text-muted-foreground border-muted'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <span className={`text-xs font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                  {step.title}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${currentStep > index ? 'bg-primary' : 'bg-muted'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="pt-6">
          {/* Step 1: Sales Order Selection */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <CardTitle className="text-lg mb-4">Selecione a Sales Order</CardTitle>
              
              {salesOrders.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Nenhuma Sales Order disponível. Crie uma SO primeiro.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-2">
                  {salesOrders.map(so => (
                    <div
                      key={so.id}
                      onClick={() => handleSelectSO(so)}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        selectedSO?.id === so.id 
                          ? 'border-primary bg-primary/5' 
                          : 'hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{so.code}</p>
                          <p className="text-sm text-muted-foreground">{so.customer}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{so.quantity} MT</p>
                          <p className="text-sm text-muted-foreground">Entrega: {so.deliveryDate}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Trade Configuration */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <CardTitle className="text-lg">Configuração do Trade</CardTitle>
              
              {/* Trade Type */}
              <div className="space-y-2">
                <Label>Tipo de Trade</Label>
                <div className="flex gap-2">
                  <Button
                    variant={tradeType === RfqTradeType.SWAP ? 'default' : 'outline'}
                    onClick={() => setTradeType(RfqTradeType.SWAP)}
                  >
                    Swap
                  </Button>
                  <Button
                    variant={tradeType === RfqTradeType.FORWARD ? 'default' : 'outline'}
                    onClick={() => setTradeType(RfqTradeType.FORWARD)}
                  >
                    Forward
                  </Button>
                </div>
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
                  <Button variant="outline" onClick={handleAddLeg} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Leg
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Counterparty Selection */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <CardTitle className="text-lg">Selecione as Contrapartes</CardTitle>
              
              {counterparties.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Nenhuma contraparte cadastrada.
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    Selecione as contrapartes que receberão a RFQ:
                  </p>
                  <div className="space-y-2">
                    {counterparties.map(cp => (
                      <div
                        key={cp.id}
                        className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                          selectedCounterparties.has(cp.id)
                            ? 'border-primary bg-primary/5'
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => handleToggleCounterparty(cp.id)}
                      >
                        <Checkbox
                          checked={selectedCounterparties.has(cp.id)}
                          onCheckedChange={() => handleToggleCounterparty(cp.id)}
                        />
                        <div className="flex-1">
                          <p className="font-medium">{cp.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Canais: {cp.channels.map(c => c.toUpperCase()).join(', ')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {selectedCounterparties.size} contraparte(s) selecionada(s)
                  </p>
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
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {getInstitutionalErrorMessage(createRfq.error || null)}
                  </AlertDescription>
                </Alert>
              )}

              {sendRfq.isError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {getInstitutionalErrorMessage(sendRfq.error || null)}
                  </AlertDescription>
                </Alert>
              )}

              {sendRfq.isSuccess && (
                <Alert>
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription>
                    RFQ enviada com sucesso!
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={goToPrevStep}
          disabled={currentStep === 0 || createRfq.isLoading || sendRfq.isLoading}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        
        {currentStep < 3 && (
          <Button
            onClick={goToNextStep}
            disabled={!canProceed()}
          >
            Próximo
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default RFQWizard;
